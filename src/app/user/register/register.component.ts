import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { RegisterValidators } from '../validators/register-validators';
import { EmailTaken } from '../validators/email-taken';
import IUser from 'src/app/models/user.model';

const MSSG_ACCOUNT_ISCREATING = 'Please wait! Your account is being created.';
const MSSG_UNEXPECTED_ERROR = 'An unexpected error ocurred. Please try again later.';
const MSSG_ACCOUNT_SUCCESS = 'Success! Your account has been created.';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent {
  constructor(
    private auth: AuthService,
    private emailTaken: EmailTaken
  ) {}

  inSubmission = false;

  name = new FormControl('', [
    Validators.required,
    Validators.minLength(3)
  ]);
  email = new FormControl('', [
    Validators.required,
    Validators.email
  ], [this.emailTaken.validate]);
  age = new FormControl<number | null>(null, [
    Validators.required,
    Validators.min(14),
    Validators.max(120)
  ]);
  password = new FormControl('', [
    Validators.required,
    Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm)
  ]);
  confirm_password = new FormControl('', [
    Validators.required
  ]);
  phoneNumber = new FormControl('', [
    Validators.required,
    Validators.minLength(13),
    Validators.maxLength(13)
  ]);
  
  showAlert = false;
  alertMsg = MSSG_ACCOUNT_ISCREATING;
  alertColor = 'blue';


  registerForm = new FormGroup({
    name: this.name,
    email: this.email,
    age: this.age,
    password: this.password,
    confirm_password: this.confirm_password,
    phoneNumber: this.phoneNumber
  }, [RegisterValidators.match('password','confirm_password')]);

  async register() {
    this.showAlert = true;
    this.alertMsg = MSSG_ACCOUNT_ISCREATING;
    this.alertColor = 'blue';
    this.inSubmission = true;

    try {
      this.auth.createUser(this.registerForm.value as IUser);
    } catch(e) {
      console.error(e);
      this.alertMsg = MSSG_UNEXPECTED_ERROR;
      this.alertColor = 'red';
      this.inSubmission = false;
      return ;
    }
    this.alertMsg = MSSG_ACCOUNT_SUCCESS;
    this.alertColor = 'green';
  }
}
