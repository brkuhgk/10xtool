/**
 * Idea Generator Addon
 * Provides creative prompts and inspiration for various activities
 */
import React, { useState, useEffect } from 'react';
import { Lightbulb, RefreshCw, Save, Bookmark, Zap, Copy, ThumbsUp, ThumbsDown } from 'lucide-react';
import './styles.css';

// Categories of creative prompts
const PROMPT_CATEGORIES = {
  WRITING: 'writing',
  DESIGN: 'design',
  BUSINESS: 'business',
  PROBLEM_SOLVING: 'problem-solving',
  ART: 'art',
  GENERAL: 'general'
};

// Sample prompts by category
const PROMPTS = {
  [PROMPT_CATEGORIES.WRITING]: [
    "Write a short story where the protagonist discovers they can hear plants talking.",
    "Describe a world where time flows backwards one day each month.",
    "Create a dialogue between two people who meet in an elevator during a power outage.",
    "Write about a character who can only speak the truth when lying down.",
    "Create a scene where someone finds an old letter they wrote to themselves years ago.",
    "Write from the perspective of an everyday object in your home.",
    "Craft a narrative about someone who discovers they're living in a simulation.",
    "Describe a perfect day, but with one surreal element that changes everything.",
    "Write a story that starts and ends with the same sentence, but with different meanings.",
    "Create a world where dreams physically manifest the next day."
  ],
  [PROMPT_CATEGORIES.DESIGN]: [
    "Design a logo for a company that makes invisible products.",
    "Create a user interface for a device from 100 years in the future.",
    "Redesign an everyday object to solve a problem most people don't realize exists.",
    "Design a poster for a music festival celebrating a genre that doesn't exist yet.",
    "Create a packaging concept that transforms into something useful after use.",
    "Design a wearable device that enhances a sense humans don't normally have.",
    "Reimagine a famous brand's identity if they shifted to a completely different industry.",
    "Create a pattern inspired by microscopic organisms.",
    "Design a book cover for your autobiography.",
    "Create a color palette inspired by your favorite meal."
  ],
  [PROMPT_CATEGORIES.BUSINESS]: [
    "Brainstorm a subscription service for something unexpected.",
    "Imagine a new use for a technology that's considered obsolete.",
    "Create a business model that generates revenue while solving an environmental problem.",
    "Develop a concept for a pop-up shop that changes its product every hour.",
    "Design a loyalty program that rewards unusual customer behaviors.",
    "Invent a service that caters to an underserved demographic.",
    "Create a marketing campaign for a product that hasn't been invented yet.",
    "Develop a business idea that combines two completely unrelated industries.",
    "Design a remote work tool that addresses a current unmet need.",
    "Conceptualize a business that operates only during specific natural phenomena."
  ],
  [PROMPT_CATEGORIES.PROBLEM_SOLVING]: [
    "How might you redesign public transportation to encourage more usage?",
    "Develop a solution to help people remember important but infrequent tasks.",
    "How could you make recycling more engaging and rewarding?",
    "Create a system to help people better manage digital distractions.",
    "Design a way to make waiting in lines more enjoyable or productive.",
    "How might you improve the experience of learning a new language?",
    "Devise a method to help people maintain long-distance relationships.",
    "Create a solution for reducing food waste in households.",
    "Design a better way to organize and find digital files and information.",
    "How might you help people develop healthier sleep habits?"
  ],
  [PROMPT_CATEGORIES.ART]: [
    "Create a piece that represents what your favorite song looks like.",
    "Make art using only materials found in your kitchen.",
    "Create a self-portrait without showing your face.",
    "Visualize an emotion you've felt but can't quite name.",
    "Create something inspired by the last dream you remember.",
    "Make a piece that incorporates shadows as a key element.",
    "Create art that incorporates text from a book opened to a random page.",
    "Design a monument for a historical event that's been forgotten.",
    "Create something that changes or completes itself over time.",
    "Make a piece of art that requires viewer participation to be complete."
  ],
  [PROMPT_CATEGORIES.GENERAL]: [
    "Combine two hobbies into a new activity.",
    "Invent a holiday that celebrates something mundane but important.",
    "Rethink how to organize your living space based on emotions rather than functions.",
    "Create a set of rules for a game played with everyday objects.",
    "Devise a new morning routine based on a fictional character's lifestyle.",
    "Create an alternate history where a minor historical event went differently.",
    "Imagine a tradition you'd like to start and pass down through generations.",
    "Design a perfect day that costs less than $10.",
    "Reinvent a system you use daily to make it more enjoyable.",
    "Create a list of questions you've never asked someone important to you."
  ]
};

const IdeaGenerator = () => {
  const [selectedCategory, setSelectedCategory] = useState(PROMPT_CATEGORIES.GENERAL);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [savedPrompts, setSavedPrompts] = useState([]);
  const [showSaved, setShowSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [likedPrompts, setLikedPrompts] = useState([]);
  
  // Load saved prompts from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('savedPrompts');
    if (saved) {
      setSavedPrompts(JSON.parse(saved));
    }
    
    const liked = localStorage.getItem('likedPrompts');
    if (liked) {
      setLikedPrompts(JSON.parse(liked));
    }
    
    // Generate initial prompt
    generatePrompt();
  }, []);
  
  // Generate a new prompt
  const generatePrompt = () => {
    setIsLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      const categoryPrompts = PROMPTS[selectedCategory];
      let newPrompt;
      
      // Ensure we don't get the same prompt twice in a row
      do {
        const randomIndex = Math.floor(Math.random() * categoryPrompts.length);
        newPrompt = categoryPrompts[randomIndex];
      } while (newPrompt === currentPrompt && categoryPrompts.length > 1);
      
      setCurrentPrompt(newPrompt);
      setIsLoading(false);
    }, 500);
  };
  
  // Change category and generate new prompt
  const changeCategory = (category) => {
    setSelectedCategory(category);
    generatePrompt();
  };
  
  // Save current prompt
  const savePrompt = () => {
    if (!currentPrompt || savedPrompts.includes(currentPrompt)) {
      return;
    }
    
    const updatedSavedPrompts = [...savedPrompts, currentPrompt];
    setSavedPrompts(updatedSavedPrompts);
    localStorage.setItem('savedPrompts', JSON.stringify(updatedSavedPrompts));
  };
  
  // Remove saved prompt
  const removeSavedPrompt = (prompt) => {
    const updatedSavedPrompts = savedPrompts.filter(p => p !== prompt);
    setSavedPrompts(updatedSavedPrompts);
    localStorage.setItem('savedPrompts', JSON.stringify(updatedSavedPrompts));
  };
  
  // Copy prompt to clipboard
  const copyPrompt = (prompt) => {
    navigator.clipboard.writeText(prompt).then(() => {
      // Visual feedback could be added here
      console.log('Copied to clipboard');
    });
  };
  
  // Like or unlike a prompt
  const toggleLikePrompt = (prompt) => {
    let updatedLikedPrompts;
    
    if (likedPrompts.includes(prompt)) {
      updatedLikedPrompts = likedPrompts.filter(p => p !== prompt);
    } else {
      updatedLikedPrompts = [...likedPrompts, prompt];
    }
    
    setLikedPrompts(updatedLikedPrompts);
    localStorage.setItem('likedPrompts', JSON.stringify(updatedLikedPrompts));
  };
  
  // Generate a new prompt when category changes
  useEffect(() => {
    if (selectedCategory) {
      generatePrompt();
    }
  }, [selectedCategory]);
  
  // Get category icon
  const getCategoryIcon = (category) => {
    switch (category) {
      case PROMPT_CATEGORIES.WRITING:
        return "✏️";
      case PROMPT_CATEGORIES.DESIGN:
        return "🎨";
      case PROMPT_CATEGORIES.BUSINESS:
        return "💼";
      case PROMPT_CATEGORIES.PROBLEM_SOLVING:
        return "🧩";
      case PROMPT_CATEGORIES.ART:
        return "🖌️";
      case PROMPT_CATEGORIES.GENERAL:
        return "💡";
      default:
        return "💭";
    }
  };
  
  return (
    <div className="idea-generator-addon">
      <div className="idea-header">
        <div className="header-title">
          <Lightbulb size={18} className="idea-icon" />
          <h2 className="idea-title">Idea Generator</h2>
        </div>
        
        <div className="idea-actions">
          <button 
            className={`idea-action-btn ${showSaved ? 'active' : ''}`}
            onClick={() => setShowSaved(!showSaved)}
            title={showSaved ? 'Show generator' : 'Saved ideas'}
          >
            <Bookmark size={16} />
          </button>
        </div>
      </div>
      
      {!showSaved ? (
        <>
          <div className="category-tabs">
            {Object.values(PROMPT_CATEGORIES).map(category => (
              <button
                key={category}
                className={`category-tab ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => changeCategory(category)}
              >
                <span className="category-icon">{getCategoryIcon(category)}</span>
                <span className="category-name">{category.replace('-', ' ')}</span>
              </button>
            ))}
          </div>
          
          <div className="prompt-container">
            {isLoading ? (
              <div className="loading-prompt">
                <RefreshCw size={24} className="spin" />
                <span>Generating idea...</span>
              </div>
            ) : (
              <div className="prompt-content">
                <p className="prompt-text">{currentPrompt}</p>
                
                <div className="prompt-actions">
                  <button 
                    className="prompt-btn refresh"
                    onClick={generatePrompt}
                    title="Generate new idea"
                  >
                    <RefreshCw size={16} />
                  </button>
                  
                  <button 
                    className="prompt-btn copy"
                    onClick={() => copyPrompt(currentPrompt)}
                    title="Copy to clipboard"
                  >
                    <Copy size={16} />
                  </button>
                  
                  <button 
                    className="prompt-btn save"
                    onClick={savePrompt}
                    disabled={savedPrompts.includes(currentPrompt)}
                    title={savedPrompts.includes(currentPrompt) ? 'Already saved' : 'Save idea'}
                  >
                    <Save size={16} />
                  </button>
                  
                  <button 
                    className={`prompt-btn like ${likedPrompts.includes(currentPrompt) ? 'active' : ''}`}
                    onClick={() => toggleLikePrompt(currentPrompt)}
                    title={likedPrompts.includes(currentPrompt) ? 'Unlike' : 'Like'}
                  >
                    {likedPrompts.includes(currentPrompt) ? 
                      <ThumbsUp size={16} /> : 
                      <ThumbsUp size={16} />
                    }
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="idea-footer">
            <button 
              className="generate-btn"
              onClick={generatePrompt}
              disabled={isLoading}
            >
              <Zap size={16} />
              <span>Generate New Idea</span>
            </button>
          </div>
        </>
      ) : (
        <div className="saved-prompts">
          <h3 className="saved-heading">Saved Ideas</h3>
          
          {savedPrompts.length === 0 ? (
            <div className="no-saved">
              <p>No saved ideas yet. Generate some ideas and save the ones you like!</p>
              <button 
                className="back-to-generator"
                onClick={() => setShowSaved(false)}
              >
                Back to Generator
              </button>
            </div>
          ) : (
            <>
              <ul className="saved-list">
                {savedPrompts.map((prompt, index) => (
                  <li key={index} className="saved-item">
                    <p className="saved-text">{prompt}</p>
                    <div className="saved-actions">
                      <button 
                        className="saved-action-btn"
                        onClick={() => copyPrompt(prompt)}
                        title="Copy to clipboard"
                      >
                        <Copy size={14} />
                      </button>
                      <button 
                        className={`saved-action-btn ${likedPrompts.includes(prompt) ? 'active' : ''}`}
                        onClick={() => toggleLikePrompt(prompt)}
                        title={likedPrompts.includes(prompt) ? 'Unlike' : 'Like'}
                      >
                        {likedPrompts.includes(prompt) ? 
                          <ThumbsUp size={14} /> : 
                          <ThumbsUp size={14} />
                        }
                      </button>
                      <button 
                        className="saved-action-btn delete"
                        onClick={() => removeSavedPrompt(prompt)}
                        title="Remove from saved"
                      >
                        <ThumbsDown size={14} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              
              <button 
                className="back-to-generator"
                onClick={() => setShowSaved(false)}
              >
                Back to Generator
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default IdeaGenerator;