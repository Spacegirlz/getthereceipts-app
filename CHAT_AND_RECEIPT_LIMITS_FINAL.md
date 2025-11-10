# 💬 Chat & Receipt Limits - Final Implementation

## ✅ Requirements Clarified

### Anonymous (Unlogged In) Free Users
- **3 truth receipts total** (lifetime)
- **5 chats per receipt**
- No daily limits

### Logged In Free Users
- **3 starter truth receipts** (lifetime)
- **1 daily truth receipt** (resets daily at midnight UTC)
  - If at 1, renews to 1 (available)
  - If at 0, renews to 0 (used, wait for next day)
  - Max 4 receipts available: 3 starter + 1 daily
- **5 chats per receipt**
- No daily chat limit (only per-receipt limit)

### Emergency Pack Users ($0.99 & $1.99)
- **$0.99 Emergency Pack**: +5 receipt credits
- **$1.99 Emergency Pack**: +10 receipt credits
- **5 chats per receipt** (same as free users)
- Credits stored in `credits_remaining` in database
- Credits are consumed when generating receipts

### Premium Users ($4.99/month)
- **Unlimited receipts**
- **40 chats per receipt**
- No daily limits

### OG Founder ($29.99/year)
- **Unlimited receipts**
- **40 chats per receipt**
- No daily limits

## 📊 Summary Table

| User Type | Receipts | Chats Per Receipt | Daily Limits |
|-----------|----------|-------------------|--------------|
| **Anonymous** | 3 total | 5 | None |
| **Free (Logged In)** | 3 starter + 1 daily | 5 | Daily receipt resets |
| **Emergency Pack** | +5 or +10 credits | 5 | None |
| **Premium** | Unlimited | 40 | None |
| **Founder** | Unlimited | 40 | None |

## ✅ Changes Made

1. ✅ Removed daily chat limit (5/day) - now only per-receipt limit
2. ✅ Updated anonymous users: 3 → 5 chats per receipt
3. ✅ Free users: 5 chats per receipt (already correct)
4. ✅ Daily receipt logic: Standard reset behavior (1 per day)

## 🎯 Emergency Pack Benefits

**$0.99 Emergency Pack:**
- +5 receipt credits
- 5 chats per receipt
- No expiration
- Credits stored in database

**$1.99 Emergency Pack:**
- +10 receipt credits
- 5 chats per receipt
- No expiration
- Credits stored in database
- Better value per credit

## 📝 Notes

- Daily receipt resets at midnight UTC
- Emergency Pack credits are consumed before starter/daily credits
- All free users (logged in and anonymous) get 5 chats per receipt
- Premium users get 40 chats per receipt

