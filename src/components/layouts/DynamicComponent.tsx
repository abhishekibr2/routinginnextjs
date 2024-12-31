import React from 'react';
import Image from 'next/image';

interface DynamicComponentProps {
    type: string;
    name: string;
    config: {
        content: string;
        height: number;
        width: number;
        id: string;
    };
}

export default function DynamicComponent({ type, config }: DynamicComponentProps) {
    const renderComponent = () => {
        switch (type) {
            case 'h1':
                return <h1 className="text-4xl font-bold mb-4">{config.content}</h1>;
            case 'h2':
                return <h2 className="text-3xl font-semibold mb-3">{config.content}</h2>;
            case 'paragraph':
                return <p className="text-base mb-4">{config.content}</p>;
            case 'image':
                return (
                    <div className="relative w-full" style={{ height: config.height || 300 }}>
                        <Image 
                            src={config.content} 
                            alt="Content image"
                            fill
                            className="object-cover rounded-lg"
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    return <div className="w-full" id={config.id}>{renderComponent()}</div>;
} 