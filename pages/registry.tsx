/* eslint-disable @typescript-eslint/no-explicit-any */
// Packages
import * as Yup from 'yup';
import { Button, FormLabel, Input } from '@chakra-ui/core';
import { Radio, RadioGroup } from 'react-radio-group';
import { Form, Formik, useField } from 'formik';
import { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import tinytime from 'tinytime';

// Components
import { Layout } from '../components/Layout';

// Utils
import { societys } from '../lib/society';
import { countries } from '../lib/country';

const countriesPhone: string[] = [
  'ar',
  'bo',
  'br',
  'cl',
  'co',
  'cr',
  'cu',
  'do',
  'ec',
  'sv',
  'gt',
  'ht',
  'hn',
  'mx',
  'ni',
  'pa',
  'py',
  'pe',
  'pr',
  'uy',
  've'
];

interface FormValues {
  name: string;
  lastName: string;
  email: string;
  birthday: Date;
  gender: string;
  phone: string;
  jobRole: string;
  country: string | any;
  city: string;
  society: string | any;
}

interface SelectProps {
  name: string;
  placeholder: string;
  options: any[];
  value: string;
  onChange: any;
  onBlur: any;
  error: any;
}

interface PhoneProps {
  value: string;
  onChange: any;
  onBlur: any;
  error: any;
}

interface DatePickerProps {
  value: any;
  onChange: any;
  onBlur: any;
  error: any;
}

interface RadioProps {
  name: string;
  label: string;
  label2: string;
  value: string;
  valueRadio: string;
  valueRadio2: string;
  onChange: any;
  error: any;
}

interface MessageProps {
  title: string;
}

const MessageError = ({ title }: MessageProps) => {
  return (
    <div
      style={{
        fontSize: 12,
        marginTop: '0.25rem',
        color: '#FF1A1A'
      }}
    >
      {title}
    </div>
  );
};

const RadioButton = (props: RadioProps) => {
  const { name, label, label2, value, valueRadio, valueRadio2, onChange, error } = props;
  return (
    <div style={{ marginBottom: '1em' }}>
      <RadioGroup
        selectedValue={value}
        onChange={select => {
          onChange(name, select);
        }}
      >
        <label style={{ marginRight: 10 }}>
          <Radio style={{ marginRight: 5 }} value={valueRadio} />
          {label}
        </label>
        <label>
          <Radio style={{ marginRight: 5 }} value={valueRadio2} />
          {label2}
        </label>
      </RadioGroup>
      <MessageError title={error} />
    </div>
  );
};

const MySelect = (props: SelectProps) => {
  const { name, placeholder, options, value, onChange, onBlur, error } = props;
  return (
    <div style={{ marginBottom: '1em' }}>
      <Select
        placeholder={placeholder}
        options={options}
        value={value}
        onChange={selectValue => {
          onChange(name, selectValue);
        }}
        onFocus={() => {
          onBlur(name, true);
        }}
      />
      <MessageError title={error} />
    </div>
  );
};

const TextInput = ({ label, ...props }: any) => {
  const [field, meta] = useField(props);
  return (
    <>
      <FormLabel htmlFor={props.id || props.name}>{label}</FormLabel>
      <Input variant="filled" {...field} {...props} />
      {meta.touched && meta.error ? <MessageError title={meta.error} /> : null}
      <div style={{ marginTop: '1em' }} />
    </>
  );
};

const InputPhone = (props: PhoneProps) => {
  const { value, onChange, onBlur, error } = props;
  return (
    <div style={{ marginBottom: '1em' }}>
      <PhoneInput
        onlyCountries={countriesPhone}
        searchPlaceholder="Tu país..."
        placeholder="Escriba tu teléfono aqui..."
        enableSearch={true}
        value={value}
        onChange={valuePhone => {
          onChange('phone', valuePhone);
        }}
        onFocus={() => {
          onBlur('phone', true);
        }}
      />
      <MessageError title={error} />
    </div>
  );
};

const DateBirthday = (props: DatePickerProps) => {
  const { value, onChange, onBlur, error } = props;
  return (
    <div style={{ marginBottom: '1em' }}>
      <DatePicker
        selected={value}
        onChange={selectValue => {
          onChange('birthday', selectValue);
        }}
        onFocus={() => {
          onBlur('birthday', true);
        }}
        isClearable
        peekNextMonth
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
      />
      <MessageError title={error} />
    </div>
  );
};

const initialValues: FormValues = {
  name: '',
  lastName: '',
  email: '',
  birthday: new Date(),
  gender: '',
  phone: '',
  jobRole: '',
  country: '',
  city: '',
  society: ''
};

const yupSchema = Yup.object({
  name: Yup.string().required('Requerido'),
  lastName: Yup.string().required('Requerido'),
  email: Yup.string()
    .email('Email invalidado')
    .required('Requerido'),
  birthday: Yup.date()
    .typeError('Ingrese una fecha de nacimiento')
    .required('Ingrese una fecha de nacimiento'),
  gender: Yup.string().required('Requerido'),
  phone: Yup.string().required('Requerido'),
  jobRole: Yup.string().required('Requerido'),
  country: Yup.string().required('Requerido'),
  city: Yup.string().required('Requerido'),
  society: Yup.string().required('Requerido')
});

const Registry = () => {
  const [succesRegistry, setRegistry] = useState<boolean>(false);
  return (
    <Layout>
      <Formik
        initialValues={initialValues}
        validationSchema={yupSchema}
        onSubmit={values => {
          const template = tinytime('{DD}/{MM}/{YYYY}');
          fetch('https://dashboard.anestesiaclasa.org/api/user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: values.name,
              lastName: values.lastName,
              birthday: template.render(values.birthday),
              email: values.email,
              phone: values.phone,
              gender: values.gender,
              jobRole: values.jobRole,
              country: values.country?.label,
              city: values.city,
              society: values.society?.label,
              date: template.render(new Date())
            })
          })
            .then(() => {
              console.log('se enviaron los datos');
              setRegistry(true);
              fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  email: values.email,
                  society: values.society?.label
                })
              });
            })
            .catch(err => {
              console.log(err);
            });
        }}
      >
        {formik => {
          const { values, errors, setFieldValue, setFieldTouched } = formik;
          return (
            <Form style={{ marginTop: '2em' }}>
              <TextInput label="Nombre" name="name" type="text" />
              <TextInput label="Apellido" name="lastName" type="text" />
              <FormLabel>Fecha de Nacimiento</FormLabel>
              <DateBirthday
                value={values.birthday}
                onChange={setFieldValue}
                onBlur={setFieldTouched}
                error={errors.birthday}
              />
              <TextInput label="Email" name="email" type="email" />
              <FormLabel>Teléfono</FormLabel>
              <InputPhone value={values.phone} onChange={setFieldValue} onBlur={setFieldTouched} error={errors.phone} />
              <FormLabel>Genero</FormLabel>
              <RadioButton
                name="gender"
                label="Masculino"
                label2="Femenino"
                value={values.gender}
                valueRadio="masculino"
                valueRadio2="femenino"
                onChange={setFieldValue}
                error={errors.gender}
              />
              <FormLabel>Categoría</FormLabel>
              <RadioButton
                name="jobRole"
                label="Anestesiólogo"
                label2="Residente"
                value={values.jobRole}
                valueRadio="anestesiólogo"
                valueRadio2="residente"
                onChange={setFieldValue}
                error={errors.jobRole}
              />
              <FormLabel>País</FormLabel>
              <MySelect
                name="country"
                placeholder="Seleccione un país..."
                value={values.country}
                options={countries}
                onChange={setFieldValue}
                onBlur={setFieldTouched}
                error={errors.country}
              />
              <TextInput label="Ciudad" name="city" type="text" />
              <FormLabel>Sociedad</FormLabel>
              <MySelect
                name="society"
                placeholder="Seleccione una sociedad..."
                value={values.society}
                options={societys}
                onChange={setFieldValue}
                onBlur={setFieldTouched}
                error={errors.society}
              />
              <Button
                type="submit"
                mb="1em"
                width="302px"
                rounded="5px"
                border="1px solid #111"
                bg="#111"
                color="#fff"
                _hover={{
                  bg: '#fff',
                  borderColor: '#000',
                  color: '#000'
                }}
                _active={{
                  bg: '#fff',
                  borderColor: '#000',
                  color: '#000'
                }}
              >
                Enviar
              </Button>
              {succesRegistry ? <p style={{ color: '#0070F3' }}>Registro exitoso</p> : null}
            </Form>
          );
        }}
      </Formik>
    </Layout>
  );
};
export default Registry;
