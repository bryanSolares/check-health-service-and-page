# Check health urls and servers

1. Gestor de paquetes para Node.js, [link para descargar gestor](https://github.com/nvm-sh/nvm).   
Si se prefiere otra forma, descargar Node.js desde la página oficial [aquí](https://nodejs.org/en). El proceso en windows, es siguiente, siguiente, siguiente.

3. Si optaste por utilizar el gestor paquetes utilizar estos comandos, si se instaló directamente Node.js, omitir.

```
nvm install 18
nvm use 18
```

3. Clonar este proyecto

```
git clone https://github.com/bryanSolares/check-health-service-and-page.git
```

3. Descargar dependencias

```
npm install
```

4. Ejecutar proyecto

```
npm run start
```

5. En navegador dirigirse a http://localhost:3000
   ![image](https://github.com/bryanSolares/check-health-service-and-page/assets/29617705/43aa130e-1aa4-4b5c-b09a-4ea465f56b64)

6. El proyecto hace uso de archivo .txt con la siguiente estructura (ver la carpeta de uploads example.txt)

```
http://google.com/
https://youtube.com/
192.168.1.1,8502,8503,22
192.168.1.2:7001,8502,8503,22
```

7. Al ejecutar la aplicación simplemente utilizar el botón de cargar archivo y posteriormente esperar al análisis.
   ![image](https://github.com/bryanSolares/check-health-service-and-page/assets/29617705/e3d98bfb-6ab7-45a9-bc91-5642bebb8403)
   ![image](https://github.com/bryanSolares/check-health-service-and-page/assets/29617705/c6563eb4-09f8-4a02-9f29-7817220a8ced)
   ![image](https://github.com/bryanSolares/check-health-service-and-page/assets/29617705/27bb453d-24fe-4555-9aa6-1b9e4e053cd7)
8. Si se desean descargar los resultados, dirigirse al final de la página y exportar los datos
   ![image](https://github.com/bryanSolares/check-health-service-and-page/assets/29617705/dc8114e1-d9d2-4218-a09e-aa5c44e6bfbd)

**Aclaraciones importantes**.
Las comprobaciones son exitosas para los casos donde la páginas Web no tiene un Exponential Backoff como medida de seguridad. Si la URL se muestra con acceso incorrecto, validar directamente desde navegador.
