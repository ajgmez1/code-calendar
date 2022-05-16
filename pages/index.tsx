import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import axios from 'axios';
import { useEffect } from 'react';

const Home: NextPage = () => {
  console.log('home');

  useEffect(() => {
    axios.get('api/hello')
      .then((d) => console.log(d));
  }, []);
  return (
    <div className={styles.container}>
      
    </div>
  )
}

export default Home
