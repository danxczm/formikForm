import { useEffect, useState } from 'react';
import { Formik, Form, useField } from 'formik';
import { Avatar, Button } from '@mui/material';
import * as Yup from 'yup';
import './styles.css';

const url = new URL(window.location.href);

const INITIAL_STATE = {
    firstName: url.searchParams.get('firstName') || '',
    lastName: url.searchParams.get('lastName') || '',
    email: url.searchParams.get('email') || '',
    acceptedTerms: false,
    jobType: '',
};

const TextInput = ({ label, helpText, ...props }) => {
    const [field, meta] = useField(props);
    const { name, value } = field;
    const [didFocus, setDidFocus] = useState(false);

    const handleFocus = () => setDidFocus(true);
    const showFeedback = (!!didFocus && field.value.trim().length > 2) || meta.touched;

    // window.sessionStorage.setItem(name, JSON.stringify(value)); // !

    useEffect(() => {
        if (value !== '') {
            url.searchParams.set(name, value);
            window.history.replaceState(null, '', url.toString());
        }
    }, [name, value]);
    return (
        <div className={`form-control ${showFeedback ? (meta.error ? 'invalid' : 'valid') : ''}`}>
            <div className="flex items-center space-between">
                <label htmlFor={props.id || props.name}>{label}</label>
                {showFeedback ? (
                    <div
                        id={`${props.id}-feedback`}
                        aria-live="polite"
                        className="feedback text-sm"
                    >
                        {meta.error ? meta.error : '✓'}
                    </div>
                ) : null}
            </div>
            <input
                aria-describedby={`${props.id}-feedback ${props.id}-help`}
                onFocus={handleFocus}
                {...field}
                {...props}
            />
        </div>
    );
};

const Select = ({ label, ...props }) => {
    const [field, meta] = useField(props);
    const [didFocus, setDidFocus] = useState(false);

    const handleFocus = () => setDidFocus(true);
    const showFeedback = (!!didFocus && field.value.trim().length > 2) || meta.touched;
    return (
        <div className={`form-control ${showFeedback ? (meta.error ? 'invalid' : 'valid') : ''}`}>
            <div className="flex items-center space-between">
                <label htmlFor={props.id || props.name}>{label}</label>
                {showFeedback ? (
                    <div
                        id={`${props.id}-feedback`}
                        aria-live="polite"
                        className="feedback text-sm"
                    >
                        {meta.error ? meta.error : '✓'}
                    </div>
                ) : null}
            </div>
            <select onFocus={handleFocus} {...field} {...props} />
        </div>
    );
};

const Checkbox = ({ children, ...props }) => {
    const [field, meta] = useField({ ...props, type: 'checkbox' });
    // const data = useField({ ...props, type: 'checkbox' });
    return (
        <div className="checkbox-input">
            <label>
                <input type="checkbox" {...field} {...props} />
                {children}
            </label>
            {meta.touched && meta.error ? <div className="error">{meta.error}</div> : null}
        </div>
    );
};

const FormComponent = () => {
    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Avatar sx={{ width: 100, height: 100 }} src="/broken-image.jpg" />
            </div>
            <div style={{ textAlign: 'center' }}>
                <h1>Welcome</h1>
                <h2>Let's create your account!</h2>
            </div>
            <Formik
                initialValues={{ ...INITIAL_STATE }}
                validationSchema={Yup.object({
                    firstName: Yup.string()
                        .min(2, 'The value is too short')
                        .max(15, 'Must be 15 characters or less')
                        .matches(/^[a-zA-Z0-9]+$/, 'Cannot contain special characters or spaces')
                        .required('First name is required'),
                    lastName: Yup.string()
                        .min(2, 'The value is too short')
                        .max(20, 'Must be 20 characters or less')
                        .matches(/^[a-zA-Z0-9]+$/, 'Cannot contain special characters or spaces')
                        .required('Last name is required'),
                    email: Yup.string()
                        .email('Invalid email address')
                        .required('Email is required'),
                    acceptedTerms: Yup.boolean()
                        .required('Email is required')
                        .oneOf([true], 'You must accept the terms and conditions.'),
                    jobType: Yup.string()
                        .oneOf(['designer', 'development', 'product', 'other'], 'Invalid Job Type')
                        .required('Required'),
                })}
                onSubmit={(values, data) => {
                    data.setSubmitting(true);
                    alert(JSON.stringify(values, null, 2));
                    data.setSubmitting(false);
                    // window.sessionStorage.clear();
                    // window.sessionStorage.removeItem('firstName');
                    // window.sessionStorage.removeItem('lastName');
                    // window.sessionStorage.removeItem('email');
                    // ! both session and local storage doesnt clear data beetwen sessions (but only the one you are in), looking for solution
                    const urlBeforeClean = new URL(window.location.href);
                    urlBeforeClean.search = '';
                    window.history.replaceState(null, '', urlBeforeClean.toString());
                    data.resetForm();
                }}
            >
                {data => (
                    <Form>
                        <TextInput
                            label="First Name"
                            name="firstName"
                            type="text"
                            placeholder="Name"
                        />

                        <TextInput
                            label="Last Name"
                            name="lastName"
                            type="text"
                            placeholder="Surname"
                        />

                        <TextInput
                            label="Email Address"
                            name="email"
                            type="text"
                            placeholder="Email"
                        />

                        <Select label="Job Type" name="jobType">
                            <option value="">Select a job type</option>
                            <option value="designer">Designer</option>
                            <option value="development">Developer</option>
                            <option value="product">Product Manager</option>
                            <option value="other">Other</option>
                        </Select>
                        <Checkbox name="acceptedTerms">I accept the terms and conditions</Checkbox>

                        <Button
                            fullWidth
                            style={{ marginTop: 25 }}
                            type="submit"
                            disabled={data.isSubmitting}
                        >
                            {data.isSubmitting ? 'Processing...' : 'Submit'}
                        </Button>
                    </Form>
                )}
            </Formik>
        </>
    );
};

export default FormComponent;
