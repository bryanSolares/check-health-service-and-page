# Check health urls and servers

1. Gestor de paquetes para Node.js, [link para descargar gestor](https://github.com/nvm-sh/nvm). Si se prefiere descargar la versión más recientes [aquí](https://nodejs.org/en). El proceso en windows, es siguiente, siguiente, siguiente.

2. Si optaste por utilizar el gestor paquetes utilizar estos comandos.

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

5. El proyecto hace uso de archivo .txt con la siguiente estructura (ver la carpeta de uploads para ejemplo)

```
http://jobpoint.claro.com.gt/
https://jobpoint.claro.com.gt/
172.21.200.224:7001,8502,8503,22
172.21.200.207:7001,8502,8503,22
```

6. Al ejecutar la aplicación simplemente utilizar el botón de cargar archivo y posteriormente esperar al análisis.
