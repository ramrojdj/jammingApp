import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import ButtonJamming from '../src/components/ButtonJamming';
import FormSearch from '../src/components/FormSearch';
import TrackItem from './components/TrackItlem';  
import './App.css'

function App() {
 
  return (
    <>
      <header>
        <h1>Jamming Spotify</h1>
      </header>
      <main>
        <section className="playlistJamming">
          <h2>Jamming Playlist</h2>
          <ul className="card-container">
          </ul>
        </section>

        <section className="search">
          <FormSearch/>
          <ul className="card-container">
            <TrackItem cover="https://i.scdn.co/image/ab67616d0000485105d081cbdc2f67d37a364d63" name="dd" artist="66" id="1"/>
          </ul>
          
        </section>
      </main>
    </>
  )
};

export default App;
