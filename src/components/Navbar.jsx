import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Navbar.module.css';

const Navbar = () => {
    return (
        <nav className={styles.navbar}>
            <div className={styles.logo}>
                <span className={styles.logoIcon}>🧠</span>
                <span className={styles.logoText}>MindBloom</span>
            </div>
            <ul className={styles.navLinks}>
                <li>
                    <NavLink
                        to="/"
                        className={({ isActive }) => isActive ? `${styles.link} ${styles.activeLink}` : styles.link}
                        end
                    >
                        Home
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/assessment"
                        className={({ isActive }) => isActive ? `${styles.link} ${styles.activeLink}` : styles.link}
                    >
                        Assessment
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/math-worlds"
                        className={({ isActive }) => isActive ? `${styles.link} ${styles.activeLink}` : styles.link}
                    >
                        Math Worlds
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/product-description"
                        className={({ isActive }) => isActive ? `${styles.link} ${styles.activeLink}` : styles.link}
                    >
                        Product Info
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
