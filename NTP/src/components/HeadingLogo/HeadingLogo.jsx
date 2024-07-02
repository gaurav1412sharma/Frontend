// HeadingLogo.jsx
import React from "react";
import csir_logo from "./csir_logo.png";
import npl_logo from "./npl_logo.png";
import styles from "./HeadingLogo.module.css";


const HeadingLogo = () => {
    return (
       <div className={styles.mainContainer}> {/* Use styles from the module */}
           <div className={styles.appContainer}>
              <div className={styles.logoContainer}>
                <img src={csir_logo} alt="CSIR Logo" className={styles.logo} />
                   <div className={styles.headingContainer}>
                      <h1 className={styles.pageTitle}>CSIR-NATIONAL PHYSICAL LABORATORY</h1>
                      <h1 className={styles.subTitle}>TIME KEEPER OF THE NATION</h1>
                   </div>
               <img src={npl_logo} alt="NPL Logo" className={styles.logo} />
             </div>
         </div>
      </div>
    );
};

export default HeadingLogo;
