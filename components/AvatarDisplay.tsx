import React, { useEffect, useRef } from 'react';

const AvatarDisplay = () => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const getCameraStream = async () => {
            try {
                console.log("Intentando acceder a dispositivos de video...");
                // Pedir permiso genérico para video. El navegador mostrará un diálogo
                // para que el usuario elija qué cámara usar.
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });

                console.log("¡Permiso concedido! Aplicando stream al video.");
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (error) {
                console.error("Error al acceder a la cámara. Asegúrate de conceder el permiso.", error);
                alert("No se pudo acceder a la cámara. Por favor, asegúrate de conceder los permisos necesarios en tu navegador y de que la cámara virtual de OBS esté activa.");
            }
        };

        getCameraStream();

        // Limpieza: detener el stream cuando el componente se desmonte
        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    return (
        <div className="w-full h-full bg-black flex items-center justify-center">
            <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted  // Muted es crucial para que autoPlay funcione sin interacción del usuario
                className="w-full h-full object-contain"
            />
        </div>
    );
};

export default AvatarDisplay;