import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura'
import { definePreset } from '@primeuix/themes';
import { MessageService } from 'primeng/api';
import { provideHttpClient } from '@angular/common/http';

// Personalizar Aura con negro como primario
  const MyPreset = definePreset(Aura, {
    semantic: {
      primary: {
        50: '#f8fafc',
        100: '#f1f5f9',
        200: '#e2e8f0',
        300: '#cbd5e1',
        400: '#94a3b8',
        500: '#000000',
        600: '#475569',
        700: '#334155',
        800: '#1e293b',
        900: '#0f172a',  // Más negro
        950: '#020617'   // Casi negro puro
      }
    }
  });



export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes,withViewTransitions()),
    MessageService,
    provideHttpClient(),
    providePrimeNG({
      theme:{
        preset:MyPreset,
        options:{
          darkModeSelector:false,
          ripple:true,
          cssLayer: {
                name: 'primeng',
                order: 'theme, base, primeng'
            }
        }
      }
    })
  ]
};
