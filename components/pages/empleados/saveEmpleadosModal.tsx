import { useState, useEffect, Fragment, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { errorValidation } from '@/utils/utilities';
import AsyncSelect from 'react-select/async';
import Tippy from '@tippyjs/react';
import dynamic from 'next/dynamic';
import { split } from 'lodash';
import InputMask from 'react-input-mask';
import {showMessage} from '@/utils/notifications'
import { validaCedula } from '@/utils/utilities';
import { apiGet, apiPost, apiPatch } from '@/lib/api/admin';


const selectDefault: {
    value: number;
    label: string;
}[] = [];

    const SaveEmpleadosModal = (props: any) => {
        const { addEmployeeModal, setAddEmployeeModal, setSaveParams, saveParams } = props;
        const [errors, setErrors] = useState<String[]>([]);
        const errorsTags = ['nombre', 'tandaLabor', 'porcientoComision', 'fechaIngreso'];
        const listTanda = ['Matutina', 'Vespertina', 'Nocturna'];
        const [loading, setLoading] = useState(false);
        const [displayedUsers, setdisplayedUsers] = useState(JSON.parse(JSON.stringify(selectDefault)));
        //const [allUser, setAllUser] = useState<any>([]);
        
        let allUser: any = useRef(null);

        
    const promiseOptionsUser = async (inputValue: string, id: any) => {
        let result = [];

        if (inputValue !== '') {
            result = allUser.current.filter((item: any) => {
                return item.name.toString().toLowerCase().includes(inputValue.toLowerCase());
            });
        } else {
            const response = await apiGet({ path: 'empleados/users' });
            result = response.info;
            allUser.current = result;
        }

        result = result.map((item: any) => {
                return {
                    value: item.id,
                    label: item.user, 
                };
        });

        setdisplayedUsers(result.filter((i: any) => i.value !== id));

        return result.filter((i: any) => i.value !== id);
    };


        const changeValue = (e: any) => {
            const { value, id } = e.target;
            let xvalue = null;
            xvalue = value === 'true' ? true : value === 'false' ? false : value;
            setSaveParams({ ...saveParams, [id]: xvalue });
        };

        const checkErrors = () => {
            const emptyList = errorValidation(errorsTags, saveParams);
            setErrors(emptyList);
            return emptyList.length;
        };

        const handleBlur = () => {
            setErrors((prevErrors) => {
                if (!validaCedula(saveParams.cedula)) {
                    return Array.from(new Set([...prevErrors, 'cedula'])); // Convierte el Set a Array
                } else {
                    return prevErrors.filter((error) => error !== 'cedula'); // Remueve si es válida
                }
            });
        };

        const saveTickets = async () => {
           try {
                setLoading(true);
                const errorsCount = checkErrors();
                if (errorsCount > 0) {
                    setLoading(false);
                    return showMessage({msg: 'Please complete the form', type: 'error'});
                }
                if (saveParams.id) {
                    // Update task
                } else {
                    // Insert task
                    // await insertTask();
                }
                setAddEmployeeModal(false);
                setSaveParams({});
                showMessage({msg:'Task saved successfully', type: 'success'});
                // refreshTasks();
            } catch (error) {
                console.error(error);
                showMessage({msg:'An error occurred while saving the task', type:'error'});
            } finally {
                setLoading(false);
            }
        }

        const onChangeValue = (newValue: any) => {
            setSaveParams({ ...saveParams, user_Id: newValue.value });
        };
    


    return (
        <Transition appear show={addEmployeeModal} as={Fragment}>
            <Dialog
                as="div"
                open={addEmployeeModal}
                onClose={() => {
                    setAddEmployeeModal(false);
                    //     setIsTktChecked(false);
                    //     setRemote(false);
                }}
                className="relative z-50"
            >
                <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-[black]/60" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center px-4 py-8">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            {/* ${auth.permissions.includes('sys-adm') || auth.permissions.includes('it-access') ? 'w-full max-w-[100%]  md:w-[70%] lg:w-[950px]' : 'w-full max-w-lg'} */}
                            <Dialog.Panel
                                className={`panel 
                            w-full max-w-lg
                             overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark`}
                            >
                                <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                    <div className="bg-[#fbfbfb] py-3 text-lg font-medium ltr:pl-5 ltr:pr-[50px] rtl:pl-[50px] rtl:pr-5 dark:bg-[#121c2c]">
                                        {saveParams?.id ? 'Editar empleados' : 'Añadir empleados'}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setAddEmployeeModal(false);
                                        }}
                                        className="text-gray-400 outline-none hover:text-gray-800 ltr:right-4 rtl:left-4 dark:hover:text-gray-600"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                        </svg>
                                    </button>
                                </div>

                                <div className="p-5 ">
                                    <form
                                    //className={`${auth.permissions.includes('sys-adm') || auth.permissions.includes('it-access') ? 'block lg:flex' : ''}`}
                                    >
                                        <div
                                        //className={`${auth.permissions.includes('sys-adm') || auth.permissions.includes('it-access') ? 'lg:m-3 lg:w-[36%]' : ''} min-w-[250px]`}
                                        >
                                            <div className={`mb-5 ${errors.includes('nombre') ? 'has-error' : ''}`}>
                                                <label htmlFor="nombre" className="form-label flex">
                                                    nombre
                                                </label>
                                                <input
                                                    id="nombre"
                                                    type="text"
                                                    placeholder="Enter nombre del empleado"
                                                    className="form-input"
                                                    value={saveParams.nombre}
                                                    onChange={(e) => changeValue(e)}
                                                />
                                            </div>
                                            <div className={`mb-5 ${errors.includes('cedula') ? 'has-error' : ''}`}>
                                                <label htmlFor="cedula" className="form-label flex">
                                                    Cedula
                                                </label>
                                                <InputMask
                                                    id="cedula"
                                                    type="text"
                                                    placeholder="000-0000000-0"
                                                    className="form-input"
                                                    mask="999-9999999-9"
                                                    value={saveParams.cedula}
                                                    onBlur={handleBlur}
                                                    onChange={(e: any) => changeValue(e)}
                                                />
                                            </div>
                                            <div className="mb-5 flex w-full flex-row gap-4">
                                                <div className={`flex-1 ${errors.includes('tandaLabor') ? 'has-error' : ''}`}>
                                                    <label htmlFor="tandaLabor" className="form-label flex">
                                                        Tanda
                                                    </label>
                                                    <select id="tandaLabor" className="form-select w-full" value={saveParams.tandaLabor || ''} onChange={changeValue}>
                                                        <option value="">Seleccione la tanda</option>
                                                        {listTanda.map((tanda: any, i: number) => (
                                                            <option key={i} value={tanda}>
                                                                {tanda}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className={`flex-1 ${errors.includes('porcientoComision') ? 'has-error' : ''}`}>
                                                    <label htmlFor="porcientoComision" className="form-label flex">
                                                        Porcentaje de Comisión
                                                    </label>
                                                    <input
                                                        id="porcientoComision"
                                                        type="number"
                                                        placeholder="Ingrese el porcentaje"
                                                        className="form-input w-full"
                                                        value={saveParams.porcientoComision || ''}
                                                        onBlur={handleBlur}
                                                        onChange={changeValue}
                                                        min="0"
                                                        max="100.00"
                                                        step="0.01"
                                                    />
                                                </div>
                                            </div>

                                            <div className={`mb-5 ${errors.includes('nombre') ? 'has-error' : ''}`}>
                                                <label htmlFor="fechaIngreso">Start Date</label>
                                                <input
                                                    id="fechaIngreso"
                                                    type="date"
                                                    name="startDate"
                                                    className={`form-input w-full rounded border p-2`}
                                                    value={split(saveParams.startDate, 'T')[0]}
                                                    onChange={(e) => changeValue(e)}
                                                />
                                            </div>
                                            <div className="custom-select css-b62m3t-container mb-5">
                                                    <label htmlFor="selectTicketType" className="flex">
                                                        Users 
                                                    </label>
                                                    <AsyncSelect //Category
                                                        cacheOptions
                                                        defaultOptions
                                                        value={displayedUsers.filter((i: any) => i.value == saveParams.user_Id)[0]}
                                                        loadOptions={promiseOptionsUser}
                                                        onChange={(newValue: any) => onChangeValue(newValue)}
                                                        menuPlacement="auto"
                                                        maxMenuHeight={120}
                                                        placeholder="Selecciona un user"
                                                    />
                                            </div>
                                        </div>

                                
                                        <div>
                                           

                                            <div className="mt-8 flex items-center justify-end ltr:text-right rtl:text-left">
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-danger"
                                                    // onClick={() => {
                                                    //     setAddEmployeeModal(false);
                                                    //     setIsTktChecked(false);
                                                    //     setRemote(false);
                                                    // }}
                                                >
                                                    Cancel
                                                </button>

                                                
                                                <button
                                                    type="button"
                                                    className={`btn btn-success ltr:ml-4 rtl:mr-4 ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
                                                    //onClick={() => saveTickets()}
                                                    disabled={loading}
                                                >
                                                    {loading ? (
                                                        <>
                                                            <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-l-transparent align-middle ltr:mr-4 rtl:ml-4"></span>
                                                            {saveParams.id ? 'Update' : 'Add'}
                                                        </>
                                                    ) : saveParams.id ? (
                                                        'Update'
                                                    ) : (
                                                        'Add'
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};
export default SaveEmpleadosModal;
