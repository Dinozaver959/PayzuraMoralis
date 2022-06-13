import Link from "next/link";
import  React from 'react';

const style = {
    outerWrapper: `sticky top-0 z-50`, // `fixed w-full z-10 top-0 left-0`,
    wrapper: `px-[0.6rem] py-[0.4rem] flex`,   // w-screen - was causing an issue where the nav bar was getting too long (width of the screen - NOT the browser window)
    headerItems: `flex items-center justify-center mr-0 ml-auto`,
    headerItem: `px-2 py-2 cursor-pointer`,
    activeNav: "text-decoration-line: underline",
}


export default function Navigation() {

    return (
        <>
            <nav className={style.wrapper}>
                <div className={style.headerItems}>    

                    <Link href="/" passHref >
                        <div className={style.headerItem}> 
                            index-test
                        </div>   
                    </Link>

                    <Link href="/createOffer" passHref >
                        <div className={style.headerItem}> 
                            createOffer
                        </div>   
                    </Link>

                    <Link href="/listPublicOffers" passHref >
                        <div className={style.headerItem}> 
                            listPublicOffers 
                        </div>   
                    </Link>       

                    <Link href="/listPersonalizedOffers" passHref >
                        <div className={style.headerItem}> 
                            listPersonalizedOffers 
                        </div>   
                    </Link>                       

                    <Link href="/myAgreements" passHref >
                        <div className={style.headerItem}> 
                            myAgreements 
                        </div>   
                    </Link>
                </div>
            </nav>
        </>
    )
}