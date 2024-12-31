import React from 'react';
import DynamicComponent from './DynamicComponent';

interface Container1_2Props {
    config: {
        children: any[];
        columns: number[];
        height: number;
        width: number;
    };
}

export default function Container1_2({ config }: Container1_2Props) {
    return (
        <div className="grid grid-cols-12 gap-4 w-full">
            <div className="col-span-6">
                {config.children
                    .filter(child => child.config.gridColumn === 0)
                    .map((child, index) => (
                        <DynamicComponent key={index} {...child} />
                    ))}
            </div>
            <div className="col-span-6">
                {config.children
                    .filter(child => child.config.gridColumn === 1)
                    .map((child, index) => (
                        <DynamicComponent key={index} {...child} />
                    ))}
            </div>
        </div>
    );
} 