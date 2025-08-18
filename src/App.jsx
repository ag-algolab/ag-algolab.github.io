import React from "react";
import "./index.css";

function App() {
  return (
    <div className="App">
      {/* HEADER */}
      <header className="header">
        <div className="logo-section">
         <img src="/logo.png" alt="AG AlgoLab Logo" className="logo" />
          <h1 className="title">AG AlgoLab</h1>
        </div>
        <nav className="nav">
          <a href="#project">Main Project</a>
          <a href="#team">Our Team</a>
          <a href="#hub">Knowledge Hub</a>
        </nav>
      </header>

      {/* HERO */}
      <section className="hero">
        <h2>AG AlgoLab</h2>
        <p>
          Research and Development in Algorithmic Trading using Deep Learning.
        </p>
      </section>

      {/* MAIN PROJECT */}
      <section id="project" className="section">
        <h2>The Main Project</h2>
        <p>
          AG AlgoLab is focused on building a cutting-edge predictive model
          powered by Artificial Intelligence. While the concept remains
          confidential, the project is already showing promising results and is
          currently in active development. It is not for sale at this stage, but
          its unique positioning makes it a highly attractive future asset.
        </p>

        <div className="cards">
          <div className="card">
            <h3>Training</h3>
            <p>
              Development of AI-driven algorithms, trained on large datasets
              using frameworks such as TensorFlow, Pandas, and NumPy.
            </p>
          </div>
          <div className="card">
            <h3>Optimization</h3>
            <p>
              Hyperparameter tuning, backtesting strategies, and advanced
              simulations with performance and PnL evaluation.
            </p>
          </div>
          <div className="card">
            <h3>Real-world Application</h3>
            <p>
              Integration and testing on real trading environments through
              MetaTrader 5.
            </p>
          </div>
          <div className="card">
            <h3>Information Transmission</h3>
            <p>
              Live reporting of signals and strategies using Telegram bots and
              automated requests.
            </p>
          </div>
        </div>
      </section>

      {/* OUR TEAM */}
      <section id="team" className="section">
        <h2>Our Team</h2>
        <div className="team-member">
          <img src="/founder.png" alt="Founder" className="founder-pic" />
          <h3>Anthony Gocmen</h3>
          <p>Founder & Lead Researcher</p>
          <p>
            Master’s student at Université Paris Dauphine – PSL, passionate
            about quantitative finance, AI, and trading algorithms. Winner of
            the Space Hackathon 2025 organized by Arizona State University.
          </p>
        </div>
      </section>

      {/* KNOWLEDGE HUB */}
      <section id="hub" className="section">
        <h2>Knowledge Hub</h2>
        <p>
          Explore our free content through YouTube channels in English and
          French.
        </p>
        <div className="videos">
          <div className="video">
            <iframe
              src="https://www.youtube.com/embed?listType=user_uploads&list=ag_algolab"
              title="AG AlgoLab EN"
              allowFullScreen
            ></iframe>
            <p>English Channel</p>
          </div>
          <div className="video">
            <iframe
              src="https://www.youtube.com/embed?listType=user_uploads&list=ag_algolab_fr"
              title="AG AlgoLab FR"
              allowFullScreen
            ></iframe>
            <p>French Channel</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="logo-section">
          <img src="/logo.png" alt="AG AlgoLab Logo" className="logo" />
          <span>AG AlgoLab</span>
        </div>
        <div className="socials">
          <a href="https://github.com/ag-algolab" target="_blank">
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/anthony-gocmen/"
            target="_blank"
          >
            LinkedIn
          </a>
          <a href="https://www.youtube.com/@ag_algolab" target="_blank">
            YouTube
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
