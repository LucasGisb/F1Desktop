class Viajes{

    mensaje;

    longitud; 
    latitud;  
    precision;
    altitud;
    precisionAltitud;
    rumbo;
    velocidad;

    constructor(){
        //obtiene la ubi y la guarda en los atributos
        navigator.geolocation.getCurrentPosition(this.getPosicion.bind(this),
                                                this.manejoErrores.bind(this));

        var botonEstatico = document.querySelector("main > section:nth-of-type(2) > input");
        botonEstatico.addEventListener("click", this.getMapaEstaticoGoogle.bind(this));
        var botonDin = document.querySelector("main > section:nth-of-type(3) > input");
        botonDin.addEventListener("click", this.initMapDinamico.bind(this));
    }

    getPosicion(posicion){
        this.mensaje = "Se ha realizado correctamente la petición de geolocalización";

        this.longitud         = posicion.coords.longitude; 
        this.latitud          = posicion.coords.latitude;  
        this.precision        = posicion.coords.accuracy;
        this.altitud          = posicion.coords.altitude;
        this.precisionAltitud = posicion.coords.altitudeAccuracy;
        this.rumbo            = posicion.coords.heading;
        this.velocidad        = posicion.coords.speed;   
        
        //NOTA: 
        //habilitar aqui el boton del estatico
        //$("section:nth-of-type(2) > input").attr("disabled", false);
        $("section:nth-of-type(2) > input").removeAttr("disabled");
        $("section:nth-of-type(3) > input").removeAttr("disabled");
    }

    manejoErrores(error){
        switch(error.code) {
            case error.PERMISSION_DENIED:
                this.mensaje = "El usuario no permite la petición de geolocalización"
                break;
            case error.POSITION_UNAVAILABLE:
                this.mensaje = "Información de geolocalización no disponible"
                break;
            case error.TIMEOUT:
                this.mensaje = "La petición de geolocalización ha caducado"
                break;
            case error.UNKNOWN_ERROR:
                this.mensaje = "Se ha producido un error desconocido"
                break;
            }
    }

    getMapaEstaticoGoogle(){

        //var ubicacion=document.querySelector("section");
        var ubicacion=document.querySelector("section:nth-of-type(2)");
        
        var apiKey = "";
        var url = "https://maps.googleapis.com/maps/api/staticmap?";
        var centro = "center=" + this.latitud + "," + this.longitud;
        var zoom ="&zoom=15";
        var tamano= "&size=400x300";
        var marcador = "&markers=color:red%7Clabel:S%7C" + this.latitud + "," + this.longitud;
        var sensor = "&sensor=false"; 
        
        this.imagenMapa = url + centro + zoom + tamano + marcador + sensor + apiKey;
        //ubicacion.innerHTML = "<img src='"+this.imagenMapa+"' alt='mapa estatico google' />";
        var imMapaEstatico = document.createElement("img");
        imMapaEstatico.src = this.imagenMapa;
        imMapaEstatico.alt = "mapa estático google";

        //borro el anterior si hay
        ubicacion.querySelectorAll("img").forEach(img => img.remove());

        ubicacion.appendChild(imMapaEstatico);
    }

    getLongitud(){
        return this.longitud;
    }
    getLatitud(){
        return this.latitud;
    }
    getAltitud(){
        return this.altitud;
    }
    verTodo(dondeVerlo){
        var ubicacion=document.querySelector("section");

        //var ubicacion=document.getElementById(dondeVerlo);
        var datos=''; 

        datos+='<p>'+this.mensaje +'</p>'; 

        datos+='<p>Longitud: '+this.longitud +' grados</p>'; 
        datos+='<p>Latitud: '+this.latitud +' grados</p>';
        datos+='<p>Precision de la latitud y longitud: '+ this.precision +' metros</p>';
        datos+='<p>Altitud: '+ this.altitud +' metros</p>';
        datos+='<p>Precision de la altitud: '+ this.precisionAltitud +' metros</p>'; 
        datos+='<p>Rumbo: '+ this.rumbo +' grados</p>'; 
        datos+='<p>Velocidad: '+ this.velocidad +' metros/segundo</p>';
        ubicacion.innerHTML = datos;
    }


    //Metodo relacionado al carrusel de imagenes
    configurarAccionesCarrusel(){
        const slides = document.querySelectorAll("article img");

        // select next slide button
                                        //DE MOMENTO ES EL SEGUNDO BOTON
        const nextSlide = document.querySelector("article button:nth-of-type(2)");

        // current slide counter
        let curSlide = 1;
        // maximum number of slides
        let maxSlide = slides.length - 1;

        // add event listener and navigation functionality
        nextSlide.addEventListener("click", function () {
        // check if current slide is the last and reset current slide
        
        if (curSlide === maxSlide) {
            curSlide = 0;
        } else {
            curSlide++;
        }

        //   move slide by -100%
        slides.forEach((slide, indx) => {
            var trans = 100 * (indx - curSlide);
            $(slide).css('transform', 'translateX(' + trans + '%)')
        });
        });

        // select next slide button
                                            //DE MOMENTO ES EL 1
        const prevSlide = document.querySelector("article button:nth-of-type(1)");

        // add event listener and navigation functionality
        prevSlide.addEventListener("click", function () {
        // check if current slide is the first and reset current slide to last
        if (curSlide === 0) {
            curSlide = maxSlide;
        } else {
            curSlide--;
        }

        //   move slide by 100%
        slides.forEach((slide, indx) => {
            var trans = 100 * (indx - curSlide);
            $(slide).css('transform', 'translateX(' + trans + '%)')
        });
        });
    }


    

    //CAMBIOS MAPA DINAMICO
    initMapDinamico(){  
        var centro = {lat: 43.3672702, lng: -5.8502461};
        //var mapaGeoposicionado = new google.maps.Map(document.getElementById('mapa'),{
    
        document.querySelector('div > h4').remove(); //h5
    
        var mapaGeoposicionado = new google.maps.Map(document.querySelector('div'),{
        //mapaGeoposicionado = new google.maps.Map(document.querySelector('section:nth-of-type(3) > div'),{
            zoom: 8,
            center:centro,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        
        var infoWindow = new google.maps.InfoWindow;
        if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(function(position) {
                var pos = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude
                };
    
                infoWindow.setPosition(pos);
                infoWindow.setContent('Localización encontrada');
                infoWindow.open(mapaGeoposicionado);
                mapaGeoposicionado.setCenter(pos);
              }, function() {
                this.handleLocationError(true, infoWindow, mapaGeoposicionado.getCenter());
              });
        } else {
              // Browser doesn't support Geolocation
              this.handleLocationError(false, infoWindow, mapaGeoposicionado.getCenter());
        }
    }
    
    handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                                  'Error: Ha fallado la geolocalización' :
                                  'Error: Su navegador no soporta geolocalización');
        infoWindow.open(mapaGeoposicionado);
    }
    
}
