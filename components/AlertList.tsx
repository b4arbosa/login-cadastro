import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

interface AlertListProps {
  alerts: string[];
}

const AlertList: React.FC<AlertListProps> = ({ alerts }) => {
  return (
    <div>
      {alerts.length > 0 ? (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {alerts.map((alert, index) => (
            <li
              key={index}
              style={{
                backgroundColor: '#FFA500', 
                color: '#fff',
                padding: '10px',
                borderRadius: '5px',
                marginBottom: '10px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <FaExclamationTriangle style={{ marginRight: '10px', color: '#fff' }} />
              {alert}
            </li>
          ))}
        </ul>
      ) : (
        <p>Sem Alertas.</p>
      )}
    </div>
  );
};

export default AlertList;
