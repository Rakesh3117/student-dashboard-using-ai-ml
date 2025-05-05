import React from "react";
import { GraduationCap } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-white shadow-inner mt-12">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <GraduationCap className="h-6 w-6 text-blue-600 mr-2" />
            <span className="text-gray-700 font-medium">
              Student Performance Predictor
            </span>
          </div>

          {/* <div className="flex items-center space-x-2 text-gray-600 text-sm">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500 fill-current" />
            <span>by</span>
            <a 
              href="https://github.com/alidiamond1/Student-Performance-Predictor"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 transition-colors flex items-center"
            >
              <Github className="h-4 w-4 mr-1" />
              alidiamond1
            </a>
          </div> */}

          <div className="text-gray-500 text-sm mt-4 md:mt-0">
            © {new Date().getFullYear()} Student Performance Predictor
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
