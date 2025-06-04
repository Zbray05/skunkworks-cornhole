import { useEffect, useState } from 'react';

export default function useModelScore(blobUrl) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {

    if (!blobUrl) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    let isCancelled = false;
    setLoading(true);
    setError(null);

    const timer = setTimeout(() => {
      if (isCancelled) return;

      try {
        const randomTeam = Math.random() < 0.5 ? 'team1' : 'team2';
        const randomPoints = Math.floor(Math.random() * 4); // 0,1,2,3

        setData({ team: randomTeam, points: randomPoints });
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    }, 1000);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [blobUrl]);

  return { data, loading, error };
}
