import React from 'react';
import Image from 'next/image';
import { TableComponent } from '../Table/Table';

interface DynamicComponentProps {
    type: string;
    name: string;
    config: {
        content: string;
        height: number;
        width: number;
        id: string;
        columns?: number[];
        children?: any[];
        gridColumn?: number;
        gridRow?: number;
    };
}

export default function DynamicComponent({ type, config }: DynamicComponentProps) {
    const renderComponent = () => {
        switch (type) {
            case 'h1':
                return (
                    <div className="w-full mb-6">
                        <h1 className="text-4xl font-bold">{config.content}</h1>
                    </div>
                );
            case 'h2':
                return (
                    <div className="w-full mb-6">
                        <h2 className="text-3xl font-semibold">{config.content}</h2>
                    </div>
                );
            case 'paragraph':
                return (
                    <div className="w-full mb-6">
                        <p className="text-base">{config.content}</p>
                    </div>
                );
            case 'image':
                return (
                    <div className="w-full mb-6">
                        <div className="relative w-full" style={{ height: config.height || 300 }}>
                            <Image 
                                src={config.content} 
                                alt="Content image"
                                fill
                                className="object-cover rounded-lg"
                            />
                        </div>
                    </div>
                );
            case 'table':
                const tableConfig = config.content ? JSON.parse(config.content) : null;
                if (!tableConfig) return null;
                
                return (
                    <div className="w-full mb-8">
                        <div className="w-full" style={{ height: config.height || 600 }}>
                            <TableComponent 
                                config={tableConfig}
                                populate={{
                                    fieldName: "filters",
                                    source: "name",
                                    endpoint: "Filters"
                                }}
                                endpoint="Users"
                            />
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div 
            className="w-full block" 
            id={config.id}
            style={{
                minHeight: type === 'table' ? config.height || 600 : 'auto',
                marginBottom: type === 'table' ? '2rem' : undefined
            }}
        >
            {renderComponent()}
        </div>
    );
}