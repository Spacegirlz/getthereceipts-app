# 💬 Sage Chat Limits - Clarification & Implementation

## Requirements Summary

### Free Users (Logged In & Anonymous)
- **5 chats per receipt** (not per day)
- Remove daily chat limit
- Keep per-receipt exchange limit

### Anonymous (Unlogged In) Free Users
- **3 truth receipts total** ✅ (already correct)
- **5 chats per receipt** ✅ (needs update - currently 3)

### Logged In Free Users
- **3 starter truth receipts** (lifetime) ✅
- **1 daily truth receipt** (resets daily)
  - If at 1, renews to 1
  - If at 0, renews to 0
  - So max 4 receipts available (3 starter + 1 daily)
- **5 chats per receipt** ✅

### Emergency Pack Users ($0.99 & $1.99)
- **Question:** What do they get?
- **Assumption:** They get credits for receipts, and 5 chats per receipt (same as free users)

## Current Implementation Issues

1. ❌ Daily chat limit (5/day) - needs to be removed
2. ❌ Anonymous users get 3 exchanges per receipt - should be 5
3. ✅ Free users get 5 exchanges per receipt - correct
4. ✅ Anonymous users get 3 receipts total - correct
5. ✅ Logged in users get 3 starter + 1 daily - correct

## Changes Needed

1. Remove daily chat limit check from `askSage.js`
2. Update anonymous user exchange limit from 3 to 5
3. Confirm Emergency Pack chat limits

