import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { ListarPlantillasComponent } from './components/plantillas/listar-plantillas/listar-plantillas.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EditarPlantillaComponent } from './components/plantillas/editar-plantilla/editar-plantilla.component';
import { CrearPlantillaComponent } from './components/plantillas/crear-plantilla/crear-plantilla.component';
import { CrearDocumentoComponent } from './components/documentos/crear-documento/crear-documento.component';
import { EditarDocumentoComponent } from './components/documentos/editar-documento/editar-documento.component';
import { ListarDocumentosComponent } from './components/documentos/listar-documentos/listar-documentos.component';
import { CrearPlantillaConSeleccionComponent } from './components/plantillas/crear-plantilla-con-seleccion/crear-plantilla-con-seleccion.component';
import { LoginComponent } from './components-user/inicio-sesion/login/login.component';
import { UserRegisterComponent } from './components-user/inicio-sesion/registro/registro.component';
import { AdminComponent } from './components/admin/admin.component';
import { UserComponent } from './components-user/user/user.component';
import { ComentariosComponent } from './components/comentarios/comentarios.component';
import { AdministrativosComponent } from './components/administrativos/administrativos.component';
import { HomeUserComponent } from './components-user/home-user/home-user.component';
import { UserProfileComponent } from './components-user/user-profile/user-profile.component';
import { BusquedaAvanzadaComponent } from './components-user/busqueda-avanzada/busqueda-avanzada.component';
import { BusquedaSencillaComponent } from './components-user/busqueda-sencilla/busqueda-sencilla.component';
import { DetallesDocumentoComponent } from './components-user/detalles-documento/detalles-documento.component';
import { SafePipe } from './safe.pipe';
import { DisableRightClickDirective } from './disable-right-click.directive';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { CarrouselUploadComponent } from './components/carrousel-upload/carrousel-upload.component';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { AccessDeniedComponent } from './access-denied/access-denied.component';

import { HomeAdminComponent } from './components/home-admin/home-admin.component';
import { ListarAdministrativosComponent } from './components/listar-administrativos/listar-administrativos.component';
import { EditarAdministrativosComponent } from './components/editar-administrativos/editar-administrativos.component';

import { LightboxModule } from 'ngx-lightbox';

@NgModule({
  declarations: [
    AppComponent,
    ListarPlantillasComponent,
    EditarPlantillaComponent,
    CrearPlantillaComponent,
    CrearDocumentoComponent,
    EditarDocumentoComponent,
    ListarDocumentosComponent,
    CrearPlantillaConSeleccionComponent,
    LoginComponent,
    AdminComponent,
    UserComponent,
    ComentariosComponent,
    AdministrativosComponent,
    UserRegisterComponent,
    HomeUserComponent,
    UserProfileComponent,
    BusquedaAvanzadaComponent,
    BusquedaSencillaComponent,
    DetallesDocumentoComponent,
    SafePipe,
    DisableRightClickDirective,
    CarrouselUploadComponent,
    AdminLoginComponent,
    AccessDeniedComponent,
    HomeAdminComponent,
    ListarAdministrativosComponent,
    EditarAdministrativosComponent

   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule, 
    FormsModule,
    ReactiveFormsModule,
    SweetAlert2Module.forRoot(),
    LightboxModule // Añade esta línea para importar el módulo ngx-lightbox

    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
