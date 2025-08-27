
import React from 'react';

const SocialIcon: React.FC<{ href: string; children: React.ReactNode; }> = ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-brand-beige hover:text-white transition-colors">
        {children}
    </a>
);

export const Footer: React.FC = () => {
    return (
        <footer className="bg-brand-green text-brand-beige py-12">
            <div className="container mx-auto px-6 text-center">
                <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl font-bold mb-4">Nerza Agency</p>
                <div className="flex justify-center space-x-6 mb-6">
                    <SocialIcon href="https://www.instagram.com/nerza.agency?utm_source=ig_web_button_share_sheet&igsh=MWV4eXk2ZDFjMnhmYg==">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                    </SocialIcon>
                    <SocialIcon href="https://www.tiktok.com/@nerza_agency.ma?is_from_webapp=1&sender_device=pc">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-2.43.05-4.84-.94-6.37-2.96-2.29-2.99-1.93-7.51.84-9.96.62-.55 1.34-.96 2.09-1.28.71-.3 1.45-.51 2.22-.61.02-3.78-.01-7.56.01-11.33H12.525z"/>
                        </svg>
                    </SocialIcon>
                </div>
                <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} Nerza Agency. Tous droits réservés.</p>
            </div>
        </footer>
    );
};