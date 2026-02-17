import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ChatMessage {
    role: 'ai' | 'user';
    content: string;
}

@Component({
    selector: 'app-ai-assistant',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './ai-assistant.component.html',
    styleUrl: './ai-assistant.component.css'
})
export class AiAssistantComponent implements OnInit {
    // 1. Inyecciones de dependencias (Ninguna por ahora)

    // 2. Propiedades y variables de la clase
    public isOpen = signal(false);
    public isTyping = signal(false);
    public messages = signal<ChatMessage[]>([
        { role: 'ai', content: '¡Hola! Soy tu asistente de IA. ¿En qué puedo ayudarte hoy?' }
    ]);

    // 3. Métodos y funciones
    ngOnInit(): void {
        // Inicialización si es necesaria
    }

    public toggleChat(): void {
        this.isOpen.set(!this.isOpen());
    }

    public sendMessage(content: string): void {
        if (!content.trim()) return;

        // Agregar mensaje del usuario
        const currentMessages = this.messages();
        this.messages.set([...currentMessages, { role: 'user', content }]);

        // Simular respuesta de IA
        this.isTyping.set(true);
        setTimeout(() => {
            this.messages.set([
                ...this.messages(),
                { role: 'ai', content: 'Aún estoy en desarrollo, pero pronto podré ayudarte con tus contratos y proyectos.' }
            ]);
            this.isTyping.set(false);
        }, 1500);
    }
}
