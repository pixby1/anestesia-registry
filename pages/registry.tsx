// tslint:disable object-literal-sort-keys jsx-no-multiline-js ordered-imports jsx-no-lambda interface-name

// Packages
import * as Yup from 'yup';
import { Button, FormLabel, Input } from '@chakra-ui/core';
import { Radio, RadioGroup } from 'react-radio-group';
import { Form, Formik, useField } from 'formik';
import React, { useState } from 'react';
import Select from 'react-select';
import tinytime from 'tinytime';

// Components
import { Layout } from '../components/Layout';

// Utils
import { societys } from '../lib/society';
import { countries } from '../lib/country';

interface CountrySelect {
  label?: string;
}

interface SocietySelect {
  label?: string;
}

interface FormValues {
  name: string;
  lastName: string;
  email: string;
  dni: string;
  jobRole: string;
  country: CountrySelect | any;
  societys: SocietySelect | any;
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

interface RadioProps {
  value: string;
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
  const { value, onChange, error } = props;
  return (
    <>
      <RadioGroup
        selectedValue={value}
        onChange={select => {
          onChange('jobRole', select);
        }}
      >
        <label style={{ marginRight: 10 }}>
          <Radio style={{ marginRight: 5 }} value="anestesiólogo" />
          anestesiólogo
        </label>
        <label>
          <Radio style={{ marginRight: 5 }} value="residente" />
          residente
        </label>
      </RadioGroup>
      <MessageError title={error} />
    </>
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

const initialValues: FormValues = {
  name: '',
  lastName: '',
  email: '',
  dni: '',
  jobRole: '',
  country: '',
  societys: ''
};

const yupSchema = Yup.object({
  name: Yup.string().required('Requerido'),
  lastName: Yup.string().required('Requerido'),
  email: Yup.string()
    .email('Email invalidado')
    .required('Requerido'),
  dni: Yup.string().required('Requerido'),
  jobRole: Yup.string().required('Requerido'),
  country: Yup.string().required('Seleccióne un país'),
  societys: Yup.string().required('Seleccióne una sociedad')
});

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
const Registry = () => {
  const [succesRegistry, setRegistry] = useState<boolean>(false);
  return (
    <Layout>
      <Formik
        initialValues={initialValues}
        validationSchema={yupSchema}
        onSubmit={values => {
          const template = tinytime('{DD}/{MM}/{YYYY}');
          fetch('https://anestesia-dashboard.justinmark.now.sh/api/user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: values.name,
              lastName: values.lastName,
              email: values.email,
              jobRole: values.jobRole,
              dni: values.dni,
              country: values.country?.label,
              society: values.societys?.label,
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
                  society: values.societys?.label
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
              <TextInput label="Email" name="email" type="email" />
              <TextInput label="DNI" name="dni" type="string" />
              <RadioButton
                value={values.jobRole}
                onChange={setFieldValue}
                error={errors.jobRole}
              />
              <FormLabel>País</FormLabel>
              <MySelect
                name="country"
                placeholder="Elija un país"
                value={values.country}
                options={countries}
                onChange={setFieldValue}
                onBlur={setFieldTouched}
                error={errors.country}
              />
              <FormLabel>Sociedad</FormLabel>
              <MySelect
                name="societys"
                placeholder="Elija una sociedad"
                value={values.societys}
                options={societys}
                onChange={setFieldValue}
                onBlur={setFieldTouched}
                error={errors.societys}
              />
              <Button
                type="submit"
                mb="1em"
                width="240px"
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
              {succesRegistry ? (
                <p style={{ color: '#0070F3' }}>Registro exitoso</p>
              ) : null}
            </Form>
          );
        }}
      </Formik>
    </Layout>
  );
};
export default Registry;
