import { useEffect, useState } from 'react';

export default function useModelScore(blobUrl)
{
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() =>
    {

        if (!blobUrl)
        {
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

        // (async () =>
        // {
        //     try
        //     {
        //         // 1. Fetch the Blob from the object URL
        //         const res = await fetch(blobUrl);
        //         if (!res.ok) throw new Error(`Failed to fetch blob: ${res.statusText}`);
        //         const videoBlob = await res.blob();

        //         // 2. Build FormData
        //         const formData = new FormData();
        //         // "video" is the field name your backend expects; adjust if needed
        //         formData.append('video', videoBlob, 'round.webm');

        //         // 3. POST to your endpoint
        //         const response = await fetch('http://localhost:5001/get_round_outcome', {
        //             method: 'POST',
        //             body: formData,
        //             // If you need headers (e.g. auth), add here.
        //             // DO NOT set Content-Type manually for FormData; browser will set the boundary.
        //         });

        //         if (!response.ok)
        //         {
        //             throw new Error(`Server error: ${response.status} ${response.statusText}`);
        //         }

        //         const json = await response.json();

        //         if (!isCancelled)
        //         {
        //             let rounddata = {
        //                 team: json.round_outcome.score.winning_team,
        //                 score: json.round_outcome.score.score_difference
        //             }
        //             setData(rounddata);
        //         }
        //     } catch (err)
        //     {
        //         if (!isCancelled)
        //         {
        //             setError(err);
        //         }
        //     } finally
        //     {
        //         if (!isCancelled)
        //         {
        //             setLoading(false);
        //         }
        //     }
        // })();

        return () =>
        {
            isCancelled = true;
            clearTimeout(timer);
        };
    }, [blobUrl]);

    return { data, loading, error };
}
