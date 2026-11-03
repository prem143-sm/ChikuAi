import { useCallback, useEffect, useRef, useState } from 'react';
import { generateLearningActivity } from '../services/learning';

export default function useGeneratedActivity(activity, grade, language, user, difficulty) {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const requestId = useRef(0);

  const refresh = useCallback(async () => {
    const request = ++requestId.current;
    setLoading(true);
    setError('');
    setItem(null);
    try {
      const generated = await generateLearningActivity({
        activity,
        grade,
        language,
        user,
        difficulty,
      });
      if (request === requestId.current) setItem(generated);
    } catch (generationError) {
      if (request === requestId.current) {
        setError(generationError.message || 'Could not load a new activity. Please try again.');
      }
    } finally {
      if (request === requestId.current) setLoading(false);
    }
  }, [activity, grade, language, user, difficulty]);

  useEffect(() => {
    refresh();
    return () => {
      requestId.current += 1;
    };
  }, [refresh]);

  return { item, loading, error, refresh };
}
