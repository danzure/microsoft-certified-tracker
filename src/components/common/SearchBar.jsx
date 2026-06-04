import { IconMap } from './IconMap';
const { Search, X } = IconMap;
import { useState, useRef } from 'react';
import { getAllCertifications } from '../../data/certificationPaths';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';

const SearchBar = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const allCerts = getAllCertifications();

  const q = query.toLowerCase().trim();
  const results = q.length > 0 
    ? allCerts.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.examCode.toLowerCase().includes(q) ||
          c.pathName.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q)
      ).slice(0, 8)
    : [];

  const handleSelect = (cert) => {
    navigate(`/path/${cert.pathId}`);
    setQuery('');
    setIsOpen(false);
    onClose?.();
  };

  return (
    <div className="search-bar">
      <div className="search-bar__input-wrapper">
        <Search size={16} className="search-bar__icon" />
        <input
          ref={inputRef}
          type="text"
          className="search-bar__input"
          placeholder="Search certifications..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(e.target.value.trim().length > 0);
          }}
          onFocus={() => query && setIsOpen(true)}
          id="search-certifications"
        />
        {query && (
          <button className="search-bar__clear" onClick={() => { setQuery(''); setIsOpen(false); }}>
            <X size={14} />
          </button>
        )}
      </div>
      {isOpen && results.length > 0 && (
        <div className="search-bar__dropdown">
          {results.map((cert) => (
            <button
              key={cert.id}
              className="search-bar__result"
              onClick={() => handleSelect(cert)}
            >
              <span className="search-bar__result-dot" style={{ background: cert.pathColor }} />
              <div className="search-bar__result-info">
                <span className="search-bar__result-code">{cert.examCode}</span>
                <span className="search-bar__result-name">{cert.name}</span>
              </div>
              <span className="search-bar__result-path">{cert.pathName}</span>
            </button>
          ))}
        </div>
      )}
      {isOpen && query && results.length === 0 && (
        <div className="search-bar__dropdown">
          <div className="search-bar__empty">No certifications found</div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
