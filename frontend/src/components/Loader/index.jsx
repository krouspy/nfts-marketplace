import './loader.css';

export const Loader = () => {
  return (
    <div id="overlay">
      <div id="overlay__inner">
        <div id="overlay__content">
          <span id="spinner"></span>
        </div>
      </div>
    </div>
  );
};

export default Loader;
