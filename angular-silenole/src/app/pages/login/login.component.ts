// COMPONENTE
import { Component, OnInit, TemplateRef, } from '@angular/core';
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
// MODAL
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
// MODELOS
import { Usuario } from 'src/app/models/usuario';
// SERVICIOS
import { UsuarioService } from 'src/app/shared/usuario.service';
import { LoginService } from 'src/app/shared/login.service';
import { ProductService } from 'src/app/shared/product.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  public modalRef: BsModalRef;
  public usuario = new Usuario(null, null, null, null, null, null, null, null, null)
  public email: string;
  public password: string;
  public password2: string;
  public form: FormGroup;
  public closeResult = '';
  public title = 'toaster-not'
  public notifyService: any;

  constructor(
    public loginService: LoginService, 
    public usuarioService: UsuarioService,
    public productService: ProductService, 
    public modalService: BsModalService,
    private fb: FormBuilder, 
    private modalService2: NgbModal, 
    private toastr: ToastrService,
    private router: Router) 
    {console.log("Funcionando servicio usuario")
    // check for existing session
    if (this.loginService.getToken() != null) {
      // ya existe session
      // cargar datos session usuario
      const user_id = this.loginService.getUserId();
      this.usuarioService.getUsuario(user_id).subscribe(data => {
        console.log(data);
        this.loginService.usuarioActual = data[0];
        this.productService.usuarioActual = data[0];
        this.router.navigate(["/home"]);
      })
    }
  }

  //METODOS
  public checkOpenSession(template: TemplateRef < any > ) {
    // check for existing session
    if (this.loginService.getToken() != null) {
      // ya existe session
      // cargar datos session usuario
      const user_id = this.loginService.getUserId();
      this.usuarioService.getUsuario(user_id).subscribe(data => {
        console.log(data);
        this.loginService.usuarioActual = data[0];
        this.productService.usuarioActual = data[0];
        this.router.navigate(["/home"]);
      })
    } else {
      this.openModal(template);
    }
  }

  public newUsuario(name: string, password: string, email: string, comunidad: string, provincia: string, localidad: string, cp: number) {
    const pass2 = ( < HTMLInputElement > document.getElementById("pass2")).value
    console.log(name, password, pass2, email, comunidad, provincia, localidad, cp)
    if (name === null || password === null || email === null || comunidad === null ||
      provincia === null || cp === null || name === "" || password === "" || email === "" || 
      comunidad === "" || provincia === "" || cp === 0 || password.length < 3) {
      this.toastr.error("Por favor, revisa todos los campos", "Algo fue mal")
    } else {
      if (password !== pass2) {
        this.toastr.error("Las contraseñas no coinciden", "Algo fue mal")
      } else {
        this.loginService.register(new Usuario(null, name, password, email, comunidad, provincia, localidad, cp, this.loginService.defaultUserPicture)).subscribe((data) => {
          console.log(data)
          if (data === null) {
            this.toastr.error("No se registró correctamente, el email ya existe", "Algo fue mal")
          } else {
            this.usuario.password = ""
            this.usuario.email = ""
            this.toastr.success("Registrado con éxito", "Bienvenido a SileNole")
            this.modalRef.hide();
          }
        })
      }
    }
  }
  
  public login(email1, password1) {
    if (email1 === null || password1 === null ||
      email1 === "" || password1 === "") {
      this.toastr.error("Por favor, revisa todos los campos", "Algo fue mal");
    }
    const user = {
      email: email1,
      password: password1
    };
    console.log(user)
    this.loginService.login(user).subscribe(data => {
      console.log(data);
      if (data !== null) {
        this.loginService.usuarioActual = data[0];
        this.productService.usuarioActual = data[0];
        console.log(this.loginService.usuarioActual);
        this.modalRef.hide();
        this.router.navigate(["/home"])
      } else {
        console.log("Usuario Inexistente")
        this.toastr.error("El ususario o la contraseña no son válidos", "Algo fue mal");
        this.router.navigate(["/"])
      }
    });
  }

  //FORMULARIOS
  onSubmit(form) {
    console.log(form.value)
  }

  initForm() {
    this.form = this.fb.group({
      'password': ['', Validators.required],
      'confirmarPassword': ['', Validators.required]
    });
  }

  //MODAL
  public openModal(template: TemplateRef < any > ) {
    this.modalRef = this.modalService.show(template)
  }

  public openUr(usuarioSubido) {
    this.modalService2.open(usuarioSubido, {
      ariaLabelledBy: 'modalEliminarCuenta'
    }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else {
      return '';
    }
  }
  
  ngOnInit() {
    this.initForm();
  }

}

  //Para usarlas en un futuro para generar nombres de ficheros aleatorios
/*   public random() {
    return Math.random().toString(36).substr(2); // Eliminar `0.`
  };

  public token() {
    return this.random() + this.random(); // Para hacer el token más largo
  }; */


