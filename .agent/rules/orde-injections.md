---
trigger: always_on
---

## Convenciones de Código (Reglas del Proyecto)
Estas reglas son obligatorias para cualquier archivo `.ts` generado o editado en este proyecto:

1. **Orden de la Clase:** - Primero: Inyecciones de dependencias (preferiblemente usando `inject()`).
   - Segundo: Propiedades y variables de la clase (`@Input`, `@Output`, `Signals`, etc.).
   - Tercero: Métodos y funciones (empezando por el ciclo de vida de Angular como `ngOnInit`).

2. **Estilo Angular:**
   - Mantener los métodos de lógica de negocio debajo de la declaración de todas las dependencias y variables de estado.