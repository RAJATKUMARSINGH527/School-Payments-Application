const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 py-6 mt-auto shadow-inner">
      <div className="container mx-auto px-6 text-center text-gray-600 dark:text-gray-400">
        &copy; {new Date().getFullYear()} School Payment Service. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
