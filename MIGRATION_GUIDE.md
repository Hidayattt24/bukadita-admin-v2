# Admin Frontend Migration Guide

## Overview

This guide documents the migration of the admin frontend from the old backend API to the new Express + Supabase backend. The migration includes updated endpoints, new response formats, and enhanced functionality.

## What's Changed

### Backend API Updates

- **Old API**: Custom endpoints with camelCase response format
- **New API**: Express + Supabase with underscore_case response format
- **Enhanced Features**: Progress tracking, quiz management, material poin details

### Updated Services

#### 1. Quiz Management (`src/lib/api/quiz.ts`)

**New Features:**

- Complete CRUD operations for quizzes and questions
- Quiz attempt tracking and scoring
- Progress integration with user stats

**Key Methods:**

```typescript
// Quiz CRUD
quizService.create(moduleId, quizData);
quizService.update(quizId, quizData);
quizService.delete(quizId);
quizService.getById(quizId);

// Question Management
quizService.addQuestion(quizId, questionData);
quizService.updateQuestion(questionId, questionData);
quizService.deleteQuestion(questionId);

// Quiz Attempts
quizService.submitAttempt(quizId, answers);
quizService.getAttempts(quizId, { page, limit });
```

#### 2. Poin Details Management (`src/lib/api/poin-details.ts`)

**New Features:**

- CRUD operations for material poin details
- Enhanced material service integration
- Support for different poin types (text, video, image)

**Key Methods:**

```typescript
poinDetailsService.create(materialId, poinData);
poinDetailsService.update(poinId, poinData);
poinDetailsService.delete(poinId);
poinDetailsService.getByMaterial(materialId);
```

#### 3. Progress Tracking (`src/lib/api/progress.ts`)

**New Features:**

- Dashboard statistics with real-time data
- User progress monitoring
- Quiz attempt analysis
- Module completion tracking

**Key Methods:**

```typescript
progressService.getProgressStats(); // Dashboard stats
progressService.getUserProgress(userId);
progressService.getQuizAttempts(filters);
```

### New Components

#### 1. Quiz Question Manager (`src/components/admin/QuizQuestionManager.tsx`)

- Complete quiz question CRUD interface
- Support for multiple-choice questions
- Real-time question management
- Form validation and error handling

#### 2. Material Poin Manager (`src/components/admin/MaterialPoinManager.tsx`)

- Poin details CRUD interface
- HTML content editing
- Type selection (text/video/image)
- Integration with material workflow

#### 3. Progress Monitoring Page (`src/components/admin/ProgressMonitoringPage.tsx`)

- User progress dashboard
- Quiz attempt monitoring
- Filtering and search capabilities
- Detailed attempt analysis

### Updated Navigation

New admin routes added:

- `/admin/modul/[id]/kuis` - Quiz question management
- `/admin/modul/[id]/materi` - Material poin management
- Progress monitoring integrated into dashboard

## API Response Format Changes

### Before (camelCase)

```json
{
  "totalUsers": 150,
  "activeUsersToday": 25,
  "totalMaterials": 30,
  "completedQuizzes": 120
}
```

### After (underscore_case)

```json
{
  "total_users": 150,
  "active_users_today": 25,
  "total_modules": 30,
  "completed_quizzes_total": 120,
  "average_completion_rate": 85.5,
  "module_completion_stats": [
    {
      "module_id": "1",
      "module_title": "Module Title",
      "total_users_started": 100,
      "total_users_completed": 80,
      "completion_rate": 80.0
    }
  ]
}
```

## Database Schema Changes

### New Tables

- `materis_quizzes` - Quiz definitions
- `materis_quiz_questions` - Quiz questions with options
- `user_quiz_progress` - User quiz attempts and scores
- `poin_details` - Material poin details

### Updated Tables

- Enhanced progress tracking fields
- Better relationship mapping
- Improved data consistency

## Testing Checklist

### Manual QA Steps

1. **Module Management**

   - [ ] Create new module
   - [ ] Edit module details
   - [ ] Delete module

2. **Material Management**

   - [ ] Create material within module
   - [ ] Add poin details to material
   - [ ] Edit poin content (text/video/image)
   - [ ] Delete poin details

3. **Quiz Management**

   - [ ] Create quiz for material
   - [ ] Add questions with multiple options
   - [ ] Edit existing questions
   - [ ] Delete questions
   - [ ] Test correct answer validation

4. **Progress Monitoring**

   - [ ] View dashboard statistics
   - [ ] Monitor user progress
   - [ ] Check quiz attempts
   - [ ] Verify completion rates

5. **User Flow Testing**
   - [ ] Simulate user completing material
   - [ ] Test quiz taking flow
   - [ ] Verify progress tracking
   - [ ] Check admin can see attempts

### Integration Testing

1. **Backend Connectivity**

   ```bash
   # Verify API endpoints are accessible
   curl -X GET http://localhost:3001/api/admin/modules
   curl -X GET http://localhost:3001/api/admin/progress/stats
   ```

2. **Authentication Flow**

   - [ ] Login with admin credentials
   - [ ] Verify session management
   - [ ] Test logout functionality

3. **Error Handling**
   - [ ] Test network error scenarios
   - [ ] Verify error message display
   - [ ] Check fallback behavior

## Environment Setup

### Required Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
```

### Development Server

```bash
npm install
npm run dev
# Server runs on http://localhost:3000 (or 3001 if 3000 is busy)
```

## Breaking Changes

### Removed Properties

- `quiz_choices` field removed from quiz questions
- Old camelCase API responses no longer supported
- Legacy progress tracking endpoints deprecated

### Updated Property Names

| Old Property       | New Property              |
| ------------------ | ------------------------- |
| `totalUsers`       | `total_users`             |
| `activeUsersToday` | `active_users_today`      |
| `totalMaterials`   | `total_modules`           |
| `completedQuizzes` | `completed_quizzes_total` |

### New Required Fields

- Quiz questions now require `correct_answer_index`
- Poin details require `poin_type` field
- Progress tracking includes `completion_percentage`

## Troubleshooting

### Common Issues

1. **Property 'X' does not exist on type error**

   - **Cause**: Using old camelCase property names
   - **Fix**: Update to underscore_case format

2. **Network connection errors**

   - **Cause**: Backend server not running or wrong URL
   - **Fix**: Check `NEXT_PUBLIC_API_BASE_URL` environment variable

3. **Authentication errors**
   - **Cause**: Invalid or expired Supabase tokens
   - **Fix**: Verify Supabase configuration and user session

### Debug Steps

1. Check browser console for JavaScript errors
2. Verify network tab for API call responses
3. Check backend server logs for errors
4. Validate environment variables are loaded

## Future Considerations

### Planned Enhancements

- Real-time progress updates using Supabase subscriptions
- Advanced quiz analytics and reporting
- Bulk operations for content management
- Enhanced user role management

### Performance Optimizations

- Implement data caching for dashboard stats
- Add pagination for large datasets
- Optimize API response sizes
- Consider implementing virtual scrolling for large lists

## Support

For issues or questions regarding this migration:

1. Check this guide first
2. Review the updated API documentation
3. Test in development environment
4. Contact the development team

---

**Migration completed on:** $(date)
**Next.js Version:** 15.5.3
**Backend API:** Express + Supabase
**Database:** PostgreSQL via Supabase
