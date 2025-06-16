import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1>Welcome to the Puzzle Competition!</h1>
      <button onClick={() => navigate('/puzzle')} className="start-btn">
        Start Puzzle
      </button>
    </div>
  );
};

export default Home;
