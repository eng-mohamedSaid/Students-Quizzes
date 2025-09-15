// UUID utility function
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const STORAGE_KEY = 'student-quizzes';

export const quizStorage = {
  // Get all quizzes
  getQuizzes() {
    try {
      const quizzes = localStorage.getItem(STORAGE_KEY);
      return quizzes ? JSON.parse(quizzes) : [];
    } catch (error) {
      console.error('Error loading quizzes:', error);
      return [];
    }
  },

  // Get a specific quiz by ID
  getQuiz(id) {
    const quizzes = this.getQuizzes();
    return quizzes.find(quiz => quiz.id === id) || null;
  },

  // Save a new quiz or update existing one
  saveQuiz(quiz) {
    try {
      const quizzes = this.getQuizzes();
      const existingIndex = quizzes.findIndex(q => q.id === quiz.id);

      if (!quiz.id) {
        quiz.id = generateUUID();
      }

      if (existingIndex >= 0) {
        quizzes[existingIndex] = quiz;
      } else {
        quizzes.push(quiz);
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(quizzes));
      return quiz;
    } catch (error) {
      console.error('Error saving quiz:', error);
      throw new Error('Failed to save quiz');
    }
  },

  // Delete a quiz
  deleteQuiz(id) {
    try {
      const quizzes = this.getQuizzes().filter(quiz => quiz.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(quizzes));
      return true;
    } catch (error) {
      console.error('Error deleting quiz:', error);
      return false;
    }
  },

  // Validate quiz data structure
  validateQuiz(quiz) {
    const errors = [];
    
    if (!quiz.title?.trim()) {
      errors.push('عنوان الاختبار مطلوب');
    }

    if (!Array.isArray(quiz.questions) || quiz.questions.length === 0) {
      errors.push('يجب إضافة سؤال واحد على الأقل');
    } else {
      quiz.questions.forEach((question, index) => {
        if (!question.text?.trim()) {
          errors.push(`السؤال ${index + 1}: نص السؤال مطلوب`);
        }
        if (!Array.isArray(question.answers) || question.answers.length !== 4) {
          errors.push(`السؤال ${index + 1}: يجب إضافة 4 إجابات`);
        }
        if (!question.correctAnswer || !question.answers.includes(question.correctAnswer)) {
          errors.push(`السؤال ${index + 1}: يجب تحديد الإجابة الصحيحة`);
        }
      });
    }

    return errors;
  }
}