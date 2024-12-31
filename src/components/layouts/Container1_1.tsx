import React from 'react';
import DynamicComponent from './DynamicComponent';

interface Container1_1Props {
    config: {
        children: any[];
        columns: number[];
        height: number;
        width: number;
    };
}

export default function Container1_1({ config }: Container1_1Props) {
    return (
        <div className="grid grid-cols-12 gap-4 w-full">
            <div className="col-span-12">
                {config.children.map((child, index) => (
                    <DynamicComponent key={index} {...child} />
                ))}
            </div>
        </div>
    );
} 