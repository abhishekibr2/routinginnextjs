import React from 'react';
import DynamicComponent from './DynamicComponent';
import { ContainerConfig } from '@/types/layout';

interface BaseContainerProps {
    config: ContainerConfig;
}

export default function BaseContainer({ config }: BaseContainerProps) {
    const getContainerClass = () => {
        const totalColumns = config.columns.reduce((acc, curr) => acc + curr, 0);
        if (totalColumns !== 12) {
            console.warn('Container columns should add up to 12');
        }
        
        // Add container-specific classes based on the type
        const columnCount = config.columns.length;
        switch (columnCount) {
            case 1: // Full width (1-1)
                return 'w-full';
            case 2: // Two columns (1-2, 2-1, etc)
                return 'w-full grid grid-cols-2';
            case 3: // Three columns (1-1-1)
                return 'w-full grid grid-cols-3';
            case 4: // Four columns (1-1-1-1)
                return 'w-full grid grid-cols-4';
            default:
                return 'w-full grid grid-cols-12';
        }
    };

    const getColumnClass = (colSize: number, totalColumns: number) => {
        // For predefined layouts, use simpler classes
        if (totalColumns <= 4) {
            return 'w-full';
        }
        
        // For 12-column grid system
        return `col-span-${colSize}`;
    };

    return (
        <div className="w-full px-4 mb-8">
            <div className={getContainerClass()}>
                {config.columns.map((colSize, colIndex) => (
                    <div 
                        key={colIndex} 
                        className={`${getColumnClass(colSize, config.columns.length)} px-4`}
                    >
                        {config.children
                            .filter(child => child.config.gridColumn === colIndex)
                            .map((child, index) => (
                                <DynamicComponent 
                                    key={`${child.config.id}-${index}`} 
                                    {...child} 
                                />
                            ))}
                    </div>
                ))}
            </div>
        </div>
    );
} 