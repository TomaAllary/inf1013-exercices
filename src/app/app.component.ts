import {Component, ViewChild} from '@angular/core';
import {Student} from "./models/Student";
import {Score} from "./models/Score";
import {OpenWeatherDTO} from "./models/openWeatherDTO";
import {
  AbstractControl,
  Form,
  FormArray,
  FormBuilder,
  FormGroup,
  Validator,
  ValidatorFn,
  Validators
} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {
  debounceTime,
  distinct, distinctUntilChanged,
  filter,
  from,
  fromEvent,
  interval,
  map,
  mergeAll,
  Observable,
  of,
  Subscription, switchMap,
  take
} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {ajax} from "rxjs/ajax";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  profileForm: FormGroup;
  title = 'inf1013';
  students: Student[];
  selected?: Student;
  index: number;
  contacts: FormArray;
  locationSub: Subscription;
  public ya: any;
  location$?: Observable<any>;
  time$?: Observable<any>;
  weather?: OpenWeatherDTO;
  liveInput?: string;


  constructor(private fb: FormBuilder, private http: HttpClient) {

    this.ya = "";
    this.locationSub = new Subscription();
    this.profileForm = this.fb.group({
      fname: ["", Validators.required],
      lname: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      contacts: this.fb.array([]),
      progam1: ["", Validators.required],
      progam2: [""],
    })
    this.contacts = this.profileForm.get('contacts') as FormArray;
    this.addContact();

    const abdul = [
      new Score('tp1', 'A'),
      new Score('tp2', 'A')
    ];
    const abdul2 = [
      new Score('exam3', 'N'),
      new Score('tp13', 'Z')
    ];
    const tom = [
      new Score('exam0', 'E'),
      new Score('test2', 'A')
    ];
    const vin = [
      new Score('mini-test', 'A+'),
      new Score('tp34', 'B')
    ];

    this.students = [
      new Student('abdul', 'ss',  abdul),
      new Student('tom', 'ss',  tom),
      new Student('vin', 'ss',  vin),
      new Student('abdul2', 'ss2', abdul2)
    ];
    this.index = 0;
  }

  ngOnInit(){
    const searchBox = document.getElementById('search-box');
    const typehead = fromEvent(searchBox!, 'input').pipe(
      map((e: any) => e.target.value),
      filter(text=>text.lenght > 2),
      debounceTime(10),
      distinctUntilChanged(),
      switchMap(()=>ajax('api'))
    )
    this.http.get<OpenWeatherDTO>("http://api.openweathermap.org/data/2.5/weather?q=montreal", { observe: 'body' })
      .subscribe(result=> {
        this.weather = result;
        console.log(this.weather);
      }, error => { console.log('erreur de requete')});


    this.time$ = new Observable(o=>{
      setInterval(() => o.next(new Date().getFullYear() +"/"+ new Date().getMonth() +"/"+ new Date().getDate() +"  "+ new Date().getHours() +" h "+ new Date().getMinutes() +" min "+ new Date().getSeconds() +" sec et " + new Date().getMilliseconds()), 50);
    });

    const clicks = fromEvent(document, 'click');
    const highOrder = clicks.pipe(
      map((e)=>interval(1000).pipe(take(10)))
    );
    const merger = mergeAll(3);
    const firstOrder = merger(highOrder);
    firstOrder.subscribe((x=>console.log(x)));


      this.location$ = new Observable((obs)=>{
      const onSucess: PositionCallback = (position => {obs.next(position)});
      const onError: PositionErrorCallback = (error => {obs.error(error)});
      let watchId: number;
      if('geolocation' in navigator){
        watchId = navigator.geolocation.watchPosition(onSucess, onError);
      }else{
        onError({code:100,message:'doh', PERMISSION_DENIED: 1, POSITION_UNAVAILABLE:1,TIMEOUT:1});
      }

      const unsub = ()=>{navigator.geolocation.clearWatch(watchId);};
      return unsub;
    });

    this.locationSub = this.location$.subscribe( (p: GeolocationPosition) => {this.ya = p.coords.latitude});
  }

  ngOnDestroy(){
    this.locationSub.unsubscribe();
  }


  select(ss: Student){
    this.selected = ss;
    this.index = this.students.findIndex((s)=>(s == ss));
  }

  next(inc: number) {
    this.index = (this.index + inc) % this.students.length;
    this.selected = this.students[this.index];
  }


  addContact() {
    this.contacts.push(this.fb.group({
      nom: ["", Validators.required],
      bureau: ["", [Validators.required, phoneNumber]],
      doordash: [""],
    }));
  }
}

export function phoneNumber(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    return (!control.value.contains('a') || control.value.length == 12) ? {phoneNumber: {value: control.value}} : null;
  };
}
