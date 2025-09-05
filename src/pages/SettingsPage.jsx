import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/database/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2, Trash2, Save, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SettingsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [settings, setSettings] = useState({ store_receipts_history: true });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('user_settings')
          .select('store_receipts_history')
          .eq('user_id', user.id)
          .single();

        if (error && error.code === 'PGRST116') {
          // No settings found, create them
          const { data: newData, error: insertError } = await supabase
            .from('user_settings')
            .insert({ user_id: user.id, store_receipts_history: true })
            .select()
            .single();
          if (insertError) throw insertError;
          setSettings(newData);
        } else if (error) {
          throw error;
        } else {
          setSettings(data);
        }
      } catch (error) {
        toast({ title: "Error fetching settings", description: error.message, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [user, toast]);

  const handleToggleHistory = async (checked) => {
    setSaving(true);
    setSettings({ ...settings, store_receipts_history: checked });
    try {
      const { error } = await supabase
        .from('user_settings')
        .update({ store_receipts_history: checked, updated_at: new Date().toISOString() })
        .eq('user_id', user.id);
      if (error) throw error;
      toast({ title: "Settings saved!", description: "Your privacy preferences have been updated." });
    } catch (error) {
      toast({ title: "Error saving settings", description: error.message, variant: "destructive" });
      setSettings({ ...settings, store_receipts_history: !checked }); // Revert on error
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteHistory = async () => {
    setDeleting(true);
    try {
      const { error } = await supabase.rpc('delete_user_receipts');
      if (error) throw error;
      toast({ title: "History Deleted!", description: "All your saved receipts have been permanently deleted." });
    } catch (error) {
      toast({ title: "Deletion Failed", description: error.message, variant: "destructive" });
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-purple-400" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Account Settings - Get The Receipts</title>
        <meta name="description" content="Manage your account settings, privacy preferences, and data." />
      </Helmet>
      <div className="container mx-auto px-4 py-16 max-w-2xl text-white">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-5xl font-black mb-2">Account Settings</h1>
          <p className="text-gray-400 mb-8">Manage your privacy and data preferences.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="meme-card p-8 rounded-2xl space-y-8"
        >
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center"><ShieldCheck className="mr-3 text-green-400"/> Privacy Controls</h2>
            <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
              <div>
                <Label htmlFor="history-switch" className="text-lg font-medium">Save My Receipt History</Label>
                <p className="text-sm text-gray-400">When on, your analysis results are saved to your dashboard.</p>
              </div>
              <Switch
                id="history-switch"
                checked={settings.store_receipts_history}
                onCheckedChange={handleToggleHistory}
                disabled={saving}
              />
            </div>
             <p className="text-xs text-gray-500 mt-2">
                If turned off, we perform the analysis and immediately forget the message and results. Nothing is stored.
              </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center"><Trash2 className="mr-3 text-red-500"/> Danger Zone</h2>
            <div className="flex items-center justify-between p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
              <div>
                <h3 className="font-medium text-lg">Delete All Receipts</h3>
                <p className="text-sm text-gray-400">This will permanently delete your entire receipt history.</p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={deleting}>
                    {deleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                    Delete History
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete all of your saved receipts from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteHistory}>Yes, delete everything</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
             <p className="text-xs text-gray-500 mt-2">
                This action is irreversible. Please be certain.
              </p>
          </div>
        </motion.div>
        <div className="mt-8 text-center">
            <Button variant="outline" onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;