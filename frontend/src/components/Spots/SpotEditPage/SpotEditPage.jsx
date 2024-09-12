import { useEffect, useState } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import './SpotEdit.css';
import * as spotActions from '../../../store/spot';

function SpotEdit() {
    const url = useLocation();
    const isNew = url.pathname.endsWith('new');
    const [isLoaded, SetIsLoaded] = useState(false);
    const [country, setCountry]= useState('');
    const [address, setAddress]= useState('');
    const [city, setCity]= useState('');
    const [state, setState]= useState('');
    const [description, setDescription]= useState('');
    const [name, setName]= useState('');
    const [price, setPrice]= useState('');
    const [imagePreview, setImagePreview]= useState('');
    const [image1, setImage1]= useState('');
    const [image2, setImage2]= useState('');
    const [image3, setImage3]= useState('');
    const [image4, setImage4]= useState('');
    
    
    

    // const isNew = url.pathname.endsWith('new');
    // const [isNew, setsIsNew] = useState(url.pathname.endsWith('new'));
    const dispatch = useDispatch();
    const { spotId } = useParams();
    const spot = useSelector(state => state.spot.spotSolo);
    // let spot;


    
    useEffect(() => {
        if (isNew) {
            dispatch(spotActions.removeSpotState());
        } else if (!isLoaded) {
            dispatch(spotActions.fetchSpot(spotId));
            SetIsLoaded(true);  
        }

        if (spot && isLoaded) {
            setCountry(spot.country);
            setAddress(spot.address);
            setCity(spot.city);
            setState(spot.state);
            setDescription(spot.description);
            setName(spot.name);
            setPrice(spot.price);
            if (spot.SpotImages.length) {
                setImagePreview(spot.SpotImages[0].url);
                setImage1(spot.SpotImages[0].url);
                setImage2(spot.SpotImages[0].url);
                setImage3(spot.SpotImages[0].url);
                setImage4(spot.SpotImages[0].url);
            }
        } 
        else {
            setCountry('');
            setAddress('');
            setCity('');
            setState('');
            setDescription('');
            setName('');
            setPrice('');
            setImagePreview('');
            setImage1('');
            setImage2('');
            setImage3('');
            setImage4('');
        }
    }, [ 
        dispatch,
        isNew, 
        isLoaded,
        spotId, 
        spot,
    ]);
  
    return (
        <div id='spotEditContainer'>
            <div id='spotEditHeader'>
                <h1>{(isNew) ? 'Create A New Spot':'Update your Spot'}</h1>
                <h3>{"Where's your place located?"}</h3>
                {isNew.toString()}{isLoaded.toString()}
                <p>Guests will only get your exact address once they booked a reservation.</p>
            </div>
            <form action="" id='spotEditForm'>
                <section className='inputSection'>
                    <div className='inputCon'>
                        <label htmlFor="country" >
                            <p className='label'>Country</p>
                            <p className='label error' style={{
                                visibility: (1)? 'visible':'hidden'
                            }}>error</p>
                            </label> 
                        <input 
                            type="text" 
                            name="country" 
                            id="country" 
                            placeholder='Country'
                            value={country}
                        />
                    </div>
                    <div className='inputCon'>
                        <label htmlFor="address" >
                            <p className='label'>Street Address</p>
                            <p className='label error' style={{
                                visibility: (1)? 'visible':'hidden'
                            }}>error</p>
                            </label> 
                        <input 
                            type="text" 
                            name="address" 
                            id="address" 
                            placeholder='Address'
                            value={address}
                        />
                    </div>
                    <div id='cityStateCon'>
                        <div className='inputCon'>
                            <label htmlFor="city" >
                                <p className='label'>City</p>
                                <p className='label error' style={{
                                    visibility: (1)? 'visible':'hidden'
                                }}>error</p>
                                </label> 
                            <input 
                                type="text" 
                                name="city" 
                                id="city" 
                                placeholder='City'
                                value={city}
                            />
                        </div>
                        <div className='inputCon'>
                            <label htmlFor="state" >
                                <p className='label'>State</p>
                                <p className='label error' style={{
                                    visibility: (1)? 'visible':'hidden'
                                }}>error</p>
                                </label> 
                            <input 
                                type="text" 
                                name="state" 
                                id="state" 
                                placeholder='STATE'
                                value={state}
                            />
                        </div>
                    </div>
                    {/* <div id='latLongCon'>
                        <div className='inputCon'>
                            <label htmlFor="lat" >
                                <p className='label'>Latitude</p>
                                <p className='label error' style={{
                                        visibility: (1)? 'visible':'hidden'
                                    }}>
                                        error
                                </p>
                                </label> 
                            <input type="text" name="lat" id="lat" />
                        </div>
                        <div className='inputCon'>
                            <label htmlFor="long" >
                                <p className='label'>Longitude</p>
                                <p className='label error' style={{
                                        visibility: (1)? 'visible':'hidden'
                                    }}>
                                        error
                                </p>
                                </label> 
                            <input type="text" name="long" id="long" />
                        </div>
                    </div> */}
                </section>
                <section className='inputSection'>
                    <h3>Describe your place to guests</h3>
                    <p>Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood.</p>
                    <textarea 
                        name="description" 
                        id="description" 
                        placeholder='Description' 
                        cols="30" rows="10"
                        value={description}
                        />
                    <p className='label error' style={{
                        visibility: (1)? 'visible':'hidden'
                    }}>error</p>
                </section>
                <section className='inputSection'>
                    <h3>Create a title for your spot</h3>
                    <p>{"Catch guests' attention with a spot title that highlights what makes your place special."}</p>
                    <input 
                        type="text" 
                        name="name" 
                        id="name" 
                        placeholder='Name of your spot'
                        value={name}
                    />
                    <p className='label error' style={{
                        visibility: (1)? 'visible':'hidden'
                    }}>error</p>
                </section>
                <section className='inputSection'>
                    <h3>Set a base price for your spot</h3>
                    <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
                    <input 
                        type="text" 
                        name="price" 
                        id="price" 
                        placeholder='Price per night (USD)'
                        value={price}
                    />
                    <p className='label error' style={{
                        visibility: (1)? 'visible':'hidden'
                    }}>error</p>
                </section>
                <section className='inputSection'>
                    <h3>Liven up your spot with photos</h3>
                    <p>Submit a link to at least one photo to publish your spot.</p>
                    <input 
                        type="text" 
                        name="imagePreview" 
                        id="imagePreview" 
                        placeholder='Preview Image URL'
                        value={imagePreview}
                    />
                    <p className='label error' style={{
                        visibility: (1)? 'visible':'hidden'
                    }}>error</p>
                    <input 
                        type="text" 
                        name="image1" 
                        id="image1" 
                        placeholder='Image URL'
                        value={image1}/>
                    <p className='label error' style={{
                        visibility: (1)? 'visible':'hidden'
                    }}>error</p>
                    <input 
                        type="text" 
                        name="image2" 
                        id="image2" 
                        placeholder='Image URL'
                        value={image2}
                    />
                    <p className='label error' style={{
                        visibility: (1)? 'visible':'hidden'
                    }}>error</p>
                    <input 
                        type="text" 
                        name="image3" 
                        id="image3" 
                        placeholder='Image URL'
                        value={image3}
                    />
                    <p className='label error' style={{
                        visibility: (1)? 'visible':'hidden'
                    }}>error</p>
                    <input 
                        type="text" 
                        name="image4" 
                        id="image4" 
                        placeholder='Image URL'
                        value={image4}/>
                    <p className='label error' style={{
                        visibility: (1)? 'visible':'hidden'
                    }}>error</p>
                </section>
                <button>Create Spot</button>
            </form>
        </div>
    );
}

export default SpotEdit;