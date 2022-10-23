import { CHART_TYPE, STATISTICAL_PATTERN_TYPE } from '@constants/common'

export default [
  {
    title: 'Daily yield',
    key: 'dailyYield',
    unit: 'kWh',
    multiply: 1000,
    type: CHART_TYPE.BAR,
    pattern: STATISTICAL_PATTERN_TYPE.SAMPLE,
    monitoringType: 'sungrowInverter'
  },
  {
    title: 'Irradiation',
    key: 'IRR',
    unit: 'W/m2',
    multiply: 1,
    type: CHART_TYPE.BAR,
    pattern: STATISTICAL_PATTERN_TYPE.SAMPLE,
    monitoringType: 'sungrowInverter'
  },
  {
    title: 'Inverter PR',
    key: 'PR',
    unit: '%',
    multiply: 1,
    type: CHART_TYPE.BAR,
    pattern: STATISTICAL_PATTERN_TYPE.SAMPLE,
    monitoringType: 'sungrowInverter'
  },
  {
    title: 'Irradiation yield',
    key: 'irrYield',
    unit: 'kWh',
    multiply: 1000,
    type: CHART_TYPE.BAR,
    pattern: STATISTICAL_PATTERN_TYPE.SAMPLE
  },
  {
    title: 'Active power',
    key: 'activePower',
    unit: 'kW',
    multiply: 1000,
    type: CHART_TYPE.BAR,
    pattern: STATISTICAL_PATTERN_TYPE.SAMPLE,
    monitoringType: 'sungrowInverter'
  },
  {
    title: 'Phase A voltage',
    key: 'phaseAVoltage',
    unit: 'V',
    multiply: 1,
    type: CHART_TYPE.BAR,
    pattern: STATISTICAL_PATTERN_TYPE.SAMPLE,
    monitoringType: 'sungrowInverter'
  },
  {
    title: 'Phase B voltage',
    key: 'phaseBVoltage',
    unit: 'V',
    multiply: 1,
    type: CHART_TYPE.BAR,
    pattern: STATISTICAL_PATTERN_TYPE.SAMPLE,
    monitoringType: 'sungrowInverter'
  },
  {
    title: 'Phase C voltage',
    key: 'phaseCVoltage',
    unit: 'V',
    multiply: 1,
    type: CHART_TYPE.BAR,
    pattern: STATISTICAL_PATTERN_TYPE.SAMPLE,
    monitoringType: 'sungrowInverter'
  },
  {
    title: 'Phase A current',
    key: 'phaseACurrent',
    unit: 'A',
    multiply: 1,
    type: CHART_TYPE.BAR,
    pattern: STATISTICAL_PATTERN_TYPE.SAMPLE,
    monitoringType: 'sungrowInverter'
  },
  {
    title: 'Phase B current',
    key: 'phaseBCurrent',
    unit: 'A',
    multiply: 1,
    type: CHART_TYPE.BAR,
    pattern: STATISTICAL_PATTERN_TYPE.SAMPLE,
    monitoringType: 'sungrowInverter'
  },
  {
    title: 'Phase C current',
    key: 'phaseCCurrent',
    unit: 'A',
    multiply: 1,
    type: CHART_TYPE.BAR,
    pattern: STATISTICAL_PATTERN_TYPE.SAMPLE,
    monitoringType: 'sungrowInverter'
  },
  {
    title: 'Reactive power',
    key: 'totalReactivePower',
    unit: 'kVAr',
    multiply: 1000,
    type: CHART_TYPE.BAR,
    pattern: STATISTICAL_PATTERN_TYPE.SAMPLE,
    monitoringType: 'sungrowInverter'
  },
  {
    title: 'Isolation resistance',
    key: 'arrayInsulationResistance',
    unit: 'kΩ',
    multiply: 1,
    type: CHART_TYPE.BAR,
    pattern: STATISTICAL_PATTERN_TYPE.SAMPLE,
    monitoringType: 'sungrowInverter'
  },
  {
    title: 'Frequency',
    key: 'gridFrequencePower',
    unit: 'Hz',
    multiply: 1,
    type: CHART_TYPE.BAR,
    pattern: STATISTICAL_PATTERN_TYPE.SAMPLE,
    monitoringType: 'sungrowInverter'
  },
  {
    title: 'Temperature',
    key: 'temperature',
    unit: '°C',
    multiply: 1,
    type: CHART_TYPE.BAR,
    pattern: STATISTICAL_PATTERN_TYPE.SAMPLE,
    monitoringType: 'sungrowInverter'
  },
  {
    title: 'DC power',
    key: 'powerDc',
    unit: 'kWp',
    multiply: 1000,
    type: CHART_TYPE.BAR,
    pattern: STATISTICAL_PATTERN_TYPE.SAMPLE,
    monitoringType: 'sungrowInverter'
  },
  {
    title: 'MPPT1 current',
    key: 'mPPT1Current',
    mpptPosition: 1,
    unit: 'A',
    multiply: 1,
    type: CHART_TYPE.BAR,
    pattern: STATISTICAL_PATTERN_TYPE.SAMPLE,
    monitoringType: 'sungrowInverter'
  },
  {
    title: 'MPPT2 current',
    key: 'mPPT2Current',
    mpptPosition: 2,
    unit: 'A',
    multiply: 1,
    type: CHART_TYPE.BAR,
    pattern: STATISTICAL_PATTERN_TYPE.SAMPLE,
    monitoringType: 'sungrowInverter'
  },
  {
    title: 'MPPT3 current',
    key: 'mPPT3Current',
    mpptPosition: 3,
    unit: 'A',
    multiply: 1,
    type: CHART_TYPE.BAR,
    pattern: STATISTICAL_PATTERN_TYPE.SAMPLE,
    monitoringType: 'sungrowInverter'
  },
  {
    title: 'MPPT4 current',
    key: 'mPPT4Current',
    mpptPosition: 4,
    unit: 'A',
    multiply: 1,
    type: CHART_TYPE.BAR,
    pattern: STATISTICAL_PATTERN_TYPE.SAMPLE,
    monitoringType: 'sungrowInverter'
  },
  {
    title: 'MPPT5 current',
    key: 'mPPT5Current',
    mpptPosition: 5,
    unit: 'A',
    multiply: 1,
    type: CHART_TYPE.BAR,
    pattern: STATISTICAL_PATTERN_TYPE.SAMPLE,
    monitoringType: 'sungrowInverter'
  },
  {
    title: 'MPPT6 current',
    key: 'mPPT6Current',
    mpptPosition: 6,
    unit: 'A',
    multiply: 1,
    type: CHART_TYPE.BAR,
    pattern: STATISTICAL_PATTERN_TYPE.SAMPLE,
    monitoringType: 'sungrowInverter'
  },
  {
    title: 'MPPT7 current',
    key: 'mPPT7Current',
    mpptPosition: 7,
    unit: 'A',
    multiply: 1,
    type: CHART_TYPE.BAR,
    pattern: STATISTICAL_PATTERN_TYPE.SAMPLE,
    monitoringType: 'sungrowInverter'
  },
  {
    title: 'MPPT8 current',
    key: 'mPPT8Current',
    mpptPosition: 8,
    unit: 'A',
    multiply: 1,
    type: CHART_TYPE.BAR,
    pattern: STATISTICAL_PATTERN_TYPE.SAMPLE,
    monitoringType: 'sungrowInverter'
  },
  {
    title: 'MPPT9 current',
    key: 'mPPT9Current',
    mpptPosition: 9,
    unit: 'A',
    multiply: 1,
    type: CHART_TYPE.BAR,
    pattern: STATISTICAL_PATTERN_TYPE.SAMPLE,
    monitoringType: 'sungrowInverter'
  },
  {
    title: 'MPPT10 current',
    key: 'mPPT10Current',
    mpptPosition: 10,
    unit: 'A',
    multiply: 1,
    type: CHART_TYPE.BAR,
    pattern: STATISTICAL_PATTERN_TYPE.SAMPLE,
    monitoringType: 'sungrowInverter'
  },
  {
    title: 'MPPT11 current',
    key: 'mPPT11Current',
    mpptPosition: 11,
    unit: 'A',
    multiply: 1,
    type: CHART_TYPE.BAR,
    pattern: STATISTICAL_PATTERN_TYPE.SAMPLE,
    monitoringType: 'sungrowInverter'
  },
  {
    title: 'MPPT12 current',
    key: 'mPPT12Current',
    mpptPosition: 12,
    unit: 'A',
    multiply: 1,
    type: CHART_TYPE.BAR,
    pattern: STATISTICAL_PATTERN_TYPE.SAMPLE,
    monitoringType: 'sungrowInverter'
  },
  {
    title: 'MPPT1 voltage',
    key: 'mPPT1Voltage',
    mpptPosition: 1,
    unit: 'V',
    multiply: 1,
    type: CHART_TYPE.BAR,
    pattern: STATISTICAL_PATTERN_TYPE.SAMPLE,
    monitoringType: 'sungrowInverter'
  },
  {
    title: 'MPPT2 voltage',
    key: 'mPPT2Voltage',
    mpptPosition: 2,
    unit: 'V',
    multiply: 1,
    type: CHART_TYPE.BAR,
    pattern: STATISTICAL_PATTERN_TYPE.SAMPLE,
    monitoringType: 'sungrowInverter'
  },
  {
    title: 'MPPT3 voltage',
    key: 'mPPT3Voltage',
    mpptPosition: 3,
    unit: 'V',
    multiply: 1,
    type: CHART_TYPE.BAR,
    pattern: STATISTICAL_PATTERN_TYPE.SAMPLE,
    monitoringType: 'sungrowInverter'
  },
  {
    title: 'MPPT4 voltage',
    key: 'mPPT4Voltage',
    mpptPosition: 4,
    unit: 'V',
    multiply: 1,
    type: CHART_TYPE.BAR,
    pattern: STATISTICAL_PATTERN_TYPE.SAMPLE,
    monitoringType: 'sungrowInverter'
  },
  {
    title: 'MPPT5 voltage',
    key: 'mPPT5Voltage',
    mpptPosition: 5,
    unit: 'V',
    multiply: 1,
    type: CHART_TYPE.BAR,
    pattern: STATISTICAL_PATTERN_TYPE.SAMPLE,
    monitoringType: 'sungrowInverter'
  },
  {
    title: 'MPPT6 voltage',
    key: 'mPPT6Voltage',
    mpptPosition: 6,
    unit: 'V',
    multiply: 1,
    type: CHART_TYPE.BAR,
    pattern: STATISTICAL_PATTERN_TYPE.SAMPLE,
    monitoringType: 'sungrowInverter'
  },
  {
    title: 'MPPT7 voltage',
    key: 'mPPT7Voltage',
    mpptPosition: 7,
    unit: 'V',
    multiply: 1,
    type: CHART_TYPE.BAR,
    pattern: STATISTICAL_PATTERN_TYPE.SAMPLE,
    monitoringType: 'sungrowInverter'
  },
  {
    title: 'MPPT8 voltage',
    key: 'mPPT8Voltage',
    mpptPosition: 8,
    unit: 'V',
    multiply: 1,
    type: CHART_TYPE.BAR,
    pattern: STATISTICAL_PATTERN_TYPE.SAMPLE,
    monitoringType: 'sungrowInverter'
  },
  {
    title: 'MPPT9 voltage',
    key: 'mPPT9Voltage',
    mpptPosition: 9,
    unit: 'V',
    multiply: 1,
    type: CHART_TYPE.BAR,
    pattern: STATISTICAL_PATTERN_TYPE.SAMPLE,
    monitoringType: 'sungrowInverter'
  },
  {
    title: 'MPPT10 voltage',
    key: 'mPPT10Voltage',
    mpptPosition: 10,
    unit: 'V',
    multiply: 1,
    type: CHART_TYPE.BAR,
    pattern: STATISTICAL_PATTERN_TYPE.SAMPLE,
    monitoringType: 'sungrowInverter'
  },
  {
    title: 'MPPT11 voltage',
    key: 'mPPT11Voltage',
    mpptPosition: 11,
    unit: 'V',
    multiply: 1,
    type: CHART_TYPE.BAR,
    pattern: STATISTICAL_PATTERN_TYPE.SAMPLE,
    monitoringType: 'sungrowInverter'
  },
  {
    title: 'MPPT12 voltage',
    key: 'mPPT12Voltage',
    mpptPosition: 12,
    unit: 'V',
    multiply: 1,
    type: CHART_TYPE.BAR,
    pattern: STATISTICAL_PATTERN_TYPE.SAMPLE,
    monitoringType: 'sungrowInverter'
  },
  {
    title: 'String 1 Current',
    key: 'string1Current',
    stringPosition: 1,
    unit: 'A',
    multiply: 1,
    type: CHART_TYPE.BAR,
    pattern: STATISTICAL_PATTERN_TYPE.SAMPLE,
    monitoringType: 'sungrowInverter'
  },
  {
    title: 'String 2 Current',
    key: 'string2Current',
    stringPosition: 2,
    unit: 'A',
    multiply: 1,
    type: CHART_TYPE.BAR,
    pattern: STATISTICAL_PATTERN_TYPE.SAMPLE,
    monitoringType: 'sungrowInverter'
  },
  {
    title: 'String 3 Current',
    key: 'string3Current',
    stringPosition: 3,
    unit: 'A',
    multiply: 1,
    type: CHART_TYPE.BAR,
    pattern: STATISTICAL_PATTERN_TYPE.SAMPLE,
    monitoringType: 'sungrowInverter'
  },
  {
    title: 'String 4 Current',
    key: 'string4Current',
    stringPosition: 4,
    unit: 'A',
    multiply: 1,
    type: CHART_TYPE.BAR,
    pattern: STATISTICAL_PATTERN_TYPE.SAMPLE,
    monitoringType: 'sungrowInverter'
  },
  {
    title: 'String 5 Current',
    key: 'string5Current',
    stringPosition: 5,
    unit: 'A',
    multiply: 1,
    type: CHART_TYPE.BAR,
    pattern: STATISTICAL_PATTERN_TYPE.SAMPLE,
    monitoringType: 'sungrowInverter'
  },
  {
    title: 'String 6 Current',
    key: 'string6Current',
    stringPosition: 6,
    unit: 'A',
    multiply: 1,
    type: CHART_TYPE.BAR,
    pattern: STATISTICAL_PATTERN_TYPE.SAMPLE,
    monitoringType: 'sungrowInverter'
  },
  {
    title: 'String 7 Current',
    key: 'string7Current',
    stringPosition: 7,
    unit: 'A',
    multiply: 1,
    type: CHART_TYPE.BAR,
    pattern: STATISTICAL_PATTERN_TYPE.SAMPLE,
    monitoringType: 'sungrowInverter'
  },
  {
    title: 'String 8 Current',
    key: 'string8Current',
    stringPosition: 8,
    unit: 'A',
    multiply: 1,
    type: CHART_TYPE.BAR,
    pattern: STATISTICAL_PATTERN_TYPE.SAMPLE,
    monitoringType: 'sungrowInverter'
  },
  {
    title: 'String 9 Current',
    key: 'string9Current',
    stringPosition: 9,
    unit: 'A',
    multiply: 1,
    type: CHART_TYPE.BAR,
    pattern: STATISTICAL_PATTERN_TYPE.SAMPLE,
    monitoringType: 'sungrowInverter'
  },
  {
    title: 'String 10 Current',
    key: 'string10Current',
    stringPosition: 10,
    unit: 'A',
    multiply: 1,
    type: CHART_TYPE.BAR,
    pattern: STATISTICAL_PATTERN_TYPE.SAMPLE,
    monitoringType: 'sungrowInverter'
  },
  {
    title: 'String 11 Current',
    key: 'string11Current',
    stringPosition: 11,
    unit: 'A',
    multiply: 1,
    type: CHART_TYPE.BAR,
    pattern: STATISTICAL_PATTERN_TYPE.SAMPLE,
    monitoringType: 'sungrowInverter'
  },
  {
    title: 'String 12 Current',
    key: 'string12Current',
    stringPosition: 12,
    unit: 'A',
    multiply: 1,
    type: CHART_TYPE.BAR,
    pattern: STATISTICAL_PATTERN_TYPE.SAMPLE,
    monitoringType: 'sungrowInverter'
  },
  {
    title: 'String 13 Current',
    key: 'string13Current',
    stringPosition: 13,
    unit: 'A',
    multiply: 1,
    type: CHART_TYPE.BAR,
    pattern: STATISTICAL_PATTERN_TYPE.SAMPLE,
    monitoringType: 'sungrowInverter'
  },
  {
    title: 'String 14 Current',
    key: 'string14Current',
    stringPosition: 14,
    unit: 'A',
    multiply: 1,
    type: CHART_TYPE.BAR,
    pattern: STATISTICAL_PATTERN_TYPE.SAMPLE,
    monitoringType: 'sungrowInverter'
  },
  {
    title: 'String 15 Current',
    key: 'string15Current',
    stringPosition: 15,
    unit: 'A',
    multiply: 1,
    type: CHART_TYPE.BAR,
    pattern: STATISTICAL_PATTERN_TYPE.SAMPLE,
    monitoringType: 'sungrowInverter'
  },
  {
    title: 'String 16 Current',
    key: 'string16Current',
    stringPosition: 16,
    unit: 'A',
    multiply: 1,
    type: CHART_TYPE.BAR,
    pattern: STATISTICAL_PATTERN_TYPE.SAMPLE,
    monitoringType: 'sungrowInverter'
  },
  {
    title: 'String 17 Current',
    key: 'string17Current',
    stringPosition: 17,
    unit: 'A',
    multiply: 1,
    type: CHART_TYPE.BAR,
    pattern: STATISTICAL_PATTERN_TYPE.SAMPLE,
    monitoringType: 'sungrowInverter'
  },
  {
    title: 'String 18 Current',
    key: 'string18Current',
    stringPosition: 18,
    unit: 'A',
    multiply: 1,
    type: CHART_TYPE.BAR,
    pattern: STATISTICAL_PATTERN_TYPE.SAMPLE,
    monitoringType: 'sungrowInverter'
  },
  {
    title: 'String 19 Current',
    key: 'string19Current',
    stringPosition: 19,
    unit: 'A',
    multiply: 1,
    type: CHART_TYPE.BAR,
    pattern: STATISTICAL_PATTERN_TYPE.SAMPLE,
    monitoringType: 'sungrowInverter'
  },
  {
    title: 'String 20 Current',
    key: 'string20Current',
    stringPosition: 20,
    unit: 'A',
    multiply: 1,
    type: CHART_TYPE.BAR,
    pattern: STATISTICAL_PATTERN_TYPE.SAMPLE,
    monitoringType: 'sungrowInverter'
  },
  {
    title: 'String 21 Current',
    key: 'string21Current',
    stringPosition: 21,
    unit: 'A',
    multiply: 1,
    type: CHART_TYPE.BAR,
    pattern: STATISTICAL_PATTERN_TYPE.SAMPLE,
    monitoringType: 'sungrowInverter'
  },
  {
    title: 'String 22 Current',
    key: 'string22Current',
    stringPosition: 22,
    unit: 'A',
    multiply: 1,
    type: CHART_TYPE.BAR,
    pattern: STATISTICAL_PATTERN_TYPE.SAMPLE,
    monitoringType: 'sungrowInverter'
  },
  {
    title: 'String 23 Current',
    key: 'string23Current',
    stringPosition: 23,
    unit: 'A',
    multiply: 1,
    type: CHART_TYPE.BAR,
    pattern: STATISTICAL_PATTERN_TYPE.SAMPLE,
    monitoringType: 'sungrowInverter'
  },
  {
    title: 'String 24 Current',
    key: 'string24Current',
    stringPosition: 24,
    unit: 'A',
    multiply: 1,
    type: CHART_TYPE.BAR,
    pattern: STATISTICAL_PATTERN_TYPE.SAMPLE,
    monitoringType: 'sungrowInverter'
  }
]
