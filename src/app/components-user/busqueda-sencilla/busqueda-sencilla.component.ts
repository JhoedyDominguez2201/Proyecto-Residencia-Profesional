
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DetallesDocumentoService } from 'src/app/services/detalles-documento.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-busqueda-sencilla',
  templateUrl: './busqueda-sencilla.component.html',
  styleUrls: ['./busqueda-sencilla.component.css']
})

export class BusquedaSencillaComponent implements OnInit {
  resultados: any[] = [];
  mouseSobreResultado: any = null; // Puedes utilizar cualquier tipo que admita null


  constructor(private route: ActivatedRoute, private detallesDocumentoService: DetallesDocumentoService, private router: Router,) { }

    ngOnInit() {
      this.route.queryParams.subscribe(params => {
        const resultadosParam = params['resultados'];
        if (resultadosParam) {
          this.resultados = JSON.parse(resultadosParam);
          console.log("resultados",this.resultados);
        }
      });
    }


    
  getCampos(resultado: any): any[] {
    const campos: any[] = [];

    const procesarPropiedades = (obj: any, prefijo: string = ''): void => {
      Object.keys(obj).forEach(key => {
        const valor = obj[key];

        if (typeof valor === 'object' && valor !== null) {
          // Propiedad anidada
          procesarPropiedades(valor, `${prefijo}${key}.`);
        } else {
          // Propiedad simple
          campos.push({ nombre: `${prefijo}${key}`, valor });
        }
      });
    };

    procesarPropiedades(resultado);

    return campos;
  }


  
  capitalizeFirstLetter(value: unknown): string {
    if (value === undefined || value === null) {
      return '';
    }

    const stringValue = String(value);
    const stringWithoutUnderscores = stringValue.replace(/_/g, ' ');

    if (typeof stringWithoutUnderscores === 'string') {
      return stringWithoutUnderscores.charAt(0).toUpperCase() + stringWithoutUnderscores.slice(1);
    }

    return '';
  }


  
  verDetalle(resultado: any) {
    // Supongamos que 'resultado' contiene información relevante
    const tipoRecurso = this.obtenerTipoRecurso(resultado['Recurso Digital']);
    const idDocumento = resultado['_id']['$oid'];
    const tipoColeccion = resultado['tipo_coleccion']; // Agregar el tipo de colección
    console.log("id", idDocumento, "tipocoleccion", tipoColeccion, "recurso", tipoRecurso);
    // Enviar parámetros al servicio
    this.detallesDocumentoService.setTipoRecurso(tipoRecurso);
    this.detallesDocumentoService.setIdDocumento(idDocumento);
    this.detallesDocumentoService.setTipoColeccion(tipoColeccion);
    
    this.router.navigate(['/user/detalle-documento']);

  }
  private obtenerTipoRecurso(recursoDigital: string[]): string {
    if (recursoDigital && recursoDigital.length > 0) {
        const primerElemento = recursoDigital[0];
        const extension = primerElemento.split('.').pop();
        return extension ? extension.toLowerCase() : '';
    } else {
        console.error('Recurso Digital no contiene elementos válidos.');
        return '';
    }
}

  
}