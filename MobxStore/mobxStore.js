import AsyncStorage from '@react-native-async-storage/async-storage';
import {action, makeObservable, observable} from 'mobx';
import {makePersistable} from 'mobx-persist-store';

class CalculationStore {
  lbs = 0;
  feet = 0;
  inch = 0;
  kg = 0;
  meter = 0;
  check = 'false';
  constructor() {
    makeObservable(
      this,
      {
        convertFeet: action,
        convertLbstoKg: action,
        convertKgToLbs: action,
        setLbs: action,
        setFeet: action,
        setKg: action,
        setMeter: action,
        setCheck: action,

        feet: observable,
        lbs: observable,
        kg: observable,
        inch: observable,
        meter: observable,
        check: observable,
      },
      {autoBind: true},
    );
    makePersistable(this, {
      name: 'CalculationPersistStore',
      properties: ['check'],
      storage: AsyncStorage,
    });
  }

  convertLbstoKg() {
    this.kg = (this.lbs * 0.453592).toFixed(3);
  }
  convertKgToLbs() {
    this.lbs = (this.kg / 0.453592).toFixed(3);
  }

  setLbs(lbs) {
    this.lbs = lbs;
  }
  setFeet(feet) {
    this.feet = feet;
  }
  setInch(inch) {
    this.inch = inch;
  }
  setKg(kg) {
    this.kg = kg;
  }
  setMeter(m) {
    this.meter = m;
  }
  setCheck(check) {
    this.check = check;
  }
  convertFeet() {
    let tempInch = this.feet * 12;
    tempInch = parseFloat(tempInch) + parseFloat(this.inch);
    this.meter = (tempInch * 0.0254).toFixed(2);
  }

  convertMeter() {
    let temp = (this.meter / 0.3048).toFixed(2);
    let tempInch = temp - temp.split('.')[0];
    tempInch = tempInch.toFixed(2) * 12;
    this.feet = temp.split('.')[0];
    this.inch = parseInt(tempInch);
  }
}
export default CalculationStore = new CalculationStore();
