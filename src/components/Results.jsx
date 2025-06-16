import { useLocation } from 'react-router-dom';

const Results = () => {
  const location = useLocation();
  const totalTime = location.state?.totalTime || 0;

  return (
    <div className="results">
      <h2>🎉 All Puzzles Completed!</h2>
      <p>Total Time Taken: {totalTime}s</p>
      <p>Thank you for playing!</p>
    </div>
  );
};

export default Results;
