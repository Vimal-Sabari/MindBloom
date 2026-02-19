import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ProductDescription.module.css';
import userPhoto from '../assets/Vimal Sabari S B.jpg';

const ProductDescription = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <button className={styles.backButton} onClick={() => navigate('/')}>
                🏠 Back to Home
            </button>

            <div className={styles.contentWrapper}>
                <h1 className={styles.mainTitle}>PRODUCT DESCRIPTION PAGE</h1>

                {/* 1. Product Details */}
                <section className={styles.section}>
                    <h2 className={styles.sectionHeader}>1. Product Details</h2>
                    <div className={styles.detailItem}>
                        <span className={styles.label}>Product Name:</span>
                        <span className={styles.value}>MindBloom</span>
                    </div>
                    <div className={styles.detailItem}>
                        <span className={styles.label}>Product Description:</span>
                        <p className={styles.value}>
                            IQ Enhancing Games for Kids with Autism is an interactive learning platform designed for children with ASD.
                            It offers sensory-friendly games that improve memory, logic, focus, and emotional skills in a safe,
                            engaging, and supportive environment. The platform adapts to individual progress, ensuring a personalized
                            learning experience that empowers children to grow at their own pace.
                        </p>
                    </div>
                    <div className={styles.detailItem}>
                        <span className={styles.label}>Technologies Used:</span>
                        <span className={styles.value}>React.js, Vite, CSS Modules, React Router, Standard CSS</span>
                    </div>
                </section>

                {/* 2. Team Member Details */}
                <section className={styles.section}>
                    <h2 className={styles.sectionHeader}>2. Team Member Details</h2>
                    <div className={styles.tableWrapper}>
                        <table className={styles.teamTable}>
                            <thead>
                                <tr>
                                    <th>Photo</th>
                                    <th>Name</th>
                                    <th>Roll Number</th>
                                    <th>Department</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className={styles.photoCell}>
                                        <img src={userPhoto} alt="Vimal Sabari S B" className={styles.profilePhoto} />
                                    </td>
                                    <td>Vimal Sabari S B</td>
                                    <td>CB.SC.U4CSE23758</td>
                                    <td>CSE</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* 3. Course Information */}
                <section className={styles.section}>
                    <h2 className={styles.sectionHeader}>3. Course Information</h2>
                    <div className={styles.detailItem}>
                        <span className={styles.label}>Course Code:</span>
                        <span className={styles.value}>23CSE461</span>
                    </div>
                    <div className={styles.detailItem}>
                        <span className={styles.label}>Course Name:</span>
                        <span className={styles.value}>Full Stack Frameworks</span>
                    </div>
                </section>

                {/* 4. Course Instructor Details */}
                <section className={styles.section}>
                    <h2 className={styles.sectionHeader}>4. Course Instructor Details</h2>
                    <div className={styles.instructorDetails}>
                        <p><strong>Name:</strong> Dr. T. Senthil Kumar</p>
                        <p><strong>Designation:</strong> Professor</p>
                        <p><strong>Department:</strong> Amrita School of Computing</p>
                        <p><strong>Institution:</strong> Amrita Vishwa Vidyapeetham</p>
                        <p><strong>Location:</strong> Coimbatore – 641112</p>
                        <p><strong>Email:</strong> t_senthilkumar@cb.amrita.edu</p>
                    </div>
                </section>

                {/* 5. GitHub Project Details */}
                <section className={styles.section}>
                    <h2 className={styles.sectionHeader}>5. GitHub Project Details</h2>

                    <div className={styles.subSection}>
                        <h3 className={styles.subHeader}>🔹 Academic Collaboration</h3>
                        <div className={styles.detailItem}>
                            <span className={styles.label}>Repository Link:</span>
                            <a href="https://github.com/Vimal-Sabari/MindBloom" target="_blank" rel="noopener noreferrer" className={styles.link}>
                                https://github.com/Vimal-Sabari/MindBloom
                            </a>
                        </div>
                        <div className={styles.detailItem}>
                            <span className={styles.label}>Contributor(s):</span>
                            <span className={styles.value}>Vimal Sabari S B</span>
                        </div>
                    </div>

                    <div className={styles.subSection}>
                        <h3 className={styles.subHeader}>🔹 Industry Collaboration</h3>
                        <div className={styles.detailItem}>
                            <span className={styles.label}>Repository Link:</span>
                            <span className={styles.value}>-</span>
                        </div>
                        <div className={styles.detailItem}>
                            <span className={styles.label}>Contributor(s):</span>
                            <span className={styles.value}>-</span>
                        </div>
                    </div>
                </section>

                {/* 6. Project Summary */}
                <section className={styles.section}>
                    <h2 className={styles.sectionHeader}>6. Project Summary</h2>
                    <div className={styles.detailItem}>
                        <span className={styles.label}>Objective:</span>
                        <p className={styles.value}>
                            To create a stimulating and accessible digital environment where children with autism can enhance their cognitive abilities through gamified learning.
                        </p>
                    </div>
                    <div className={styles.detailItem}>
                        <span className={styles.label}>Outcome:</span>
                        <p className={styles.value}>
                            A deployed web application featuring a suite of IQ-enhancing games that successfully engage users and provide measurable progress in memory and focus.
                        </p>
                    </div>
                    <div className={styles.detailItem}>
                        <span className={styles.label}>Future Enhancements:</span>
                        <p className={styles.value}>
                            Integration of advanced AI for adaptive difficulty scaling, mobile application development for broader accessibility, and expanded game library with social interaction features.
                        </p>
                    </div>
                </section>

            </div>
        </div>
    );
};

export default ProductDescription;
