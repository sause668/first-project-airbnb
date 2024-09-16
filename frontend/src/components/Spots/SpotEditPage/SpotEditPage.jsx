import { useEffect, useState } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import './SpotEdit.css';
import * as spotActions from '../../../store/spot';
import * as spotImageActions from '../../../store/spotImage'

function SpotEdit() {
    const url = useLocation();
    const isNew = url.pathname.endsWith('new');
    const [isLoaded, setIsLoaded] = useState(false);
    const [country, setCountry] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [description, setDescription] = useState('');
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [imagePreview, setImagePreview] = useState('');
    const [image1, setImage1] = useState('');
    const [image2, setImage2] = useState('');
    const [image3, setImage3] = useState('');
    const [image4, setImage4] = useState('');
    const [errors, setErrors] = useState({});
    const [imageErrors, setImageErrors] = useState(['','','','','']);
    
    const dispatch = useDispatch();
    const { spotId } = useParams();
    const navigate = useNavigate();
    const spot = useSelector(state => state.spot.spotSolo);

    const validateImages = () => {
        const imgArr = [imagePreview, image1, image2, image3, image4];
        let isValid = true;
        const imageErrorsTemp = imageErrors

        const isPic = (url) => {
            return url.endsWith('.png') || url.endsWith('.jpg') || url.endsWith('.jpeg') || url === '';
        }

        imgArr.forEach((image, index) => {
            if (!isPic(image)) {
                imageErrorsTemp[index] = 'Image URL must end in .png, .jpg, or .jpeg';
                isValid = false;
            }
        });

        if (imagePreview === '') {
            imageErrorsTemp[0] = 'Preview image is required.';
            isValid = false;
        }

        if (!isValid) {
            setImageErrors(imageErrorsTemp);
            return false;
        }

        return true
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});
        if (isNew) {
            let newSpotId;
            const isValidImages = validateImages();
            return dispatch(spotActions.createSpot({
                country,
                address,
                state,
                city,
                lat: 0,
                lng: 0,
                name,
                price,
                description
            }))
            .then((newSpot) => {
                newSpotId = newSpot.id;
            })
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) {
                    setErrors(data.errors);
                }
            })
            .then(() => {
                if (isValidImages && newSpotId) {
                    dispatch(spotImageActions.createSpotImage({
                        spotId: newSpotId,
                        url: imagePreview,
                        preview: true
                    }))
                } else {
                    dispatch(spotActions.deleteSpot(newSpotId));
                    throw Error;
                }
            })
            .then(() => navigate(`/spots/${newSpotId}`))
            .catch()
            .then(() => {
                const spotImageArr = [image1, image2, image3, image4];

                spotImageArr.forEach(url => {
                    if (url) dispatch(spotImageActions.createSpotImage({
                        spotId: newSpotId,
                        url: url,
                        preview: false
                    }))
                })
            })
            .catch();

            
        } else {
            return dispatch(spotActions.editSpot({
                spotId,
                country,
                address,
                state,
                city,
                lat: 0,
                lng: 0,
                name,
                price,
                description
            }))
            .then(() => {
                navigate(`/spots/${spotId}`);
            })
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) {
                    setErrors(data.errors);
                }
            });
        }
    }


    
    useEffect(() => {
        if (isNew) {
            dispatch(spotActions.removeSpotState());
        } else if (!isLoaded) {
            dispatch(spotActions.fetchSpot(spotId))
            .then(() => setIsLoaded(true));  
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
        <div id='spotEditCon'>
            <div id='spotEditTitleCon'>
                <h1 id='spotEditTitle'>{(isNew) ? 'Create A New Spot':'Update your Spot'}</h1>
                <h3 className='spotEditTitleSub'>{"Where's your place located?"}</h3>
                {/* {isNew.toString()}{isLoaded.toString()} */}
                <p className='spotEditTitleDetails'>Guests will only get your exact address once they booked a reservation.</p>
            </div>
            <form onSubmit={handleSubmit} id='spotEditForm'>
                <section className='inputSection'>
                    {/* Country */}
                    <div className='inputCon'>
                        <label className='inputLabelCon' htmlFor="country" >
                            <p className='labelTitle'>Country</p>
                            <p className='labelTitle error'>{errors.country}</p>
                            </label> 
                        <input 
                            type="text" 
                            name="country" 
                            id="country" 
                            className='spotInput'
                            placeholder='Country'
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                        />
                    </div>
                    {/* Address */}
                    <div className='inputCon'>
                        <label className='inputLabelCon' htmlFor="address" >
                            <p className='labelTitle'>Street Address</p>
                            <p className='labelTitle error'>{errors.address}</p>
                            </label> 
                        <input 
                            type="text" 
                            name="address" 
                            id="address" 
                            className='spotInput'
                            placeholder='Address'
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>
                </section>
                <section className='inputSection2'>
                        {/* City */}
                    <div className='inputCon'>
                        <label className='inputLabelCon' htmlFor="city" >
                            <p className='labelTitle'>City</p>
                            <p className='labelTitle error'>{errors.city}</p>
                        </label> 
                        <input 
                            type="text" 
                            name="city" 
                            id="city" 
                            className='spotInput'
                            placeholder='City'
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                        />
                    </div>
                    <p className='comma'>,</p>
                    {/* State */}
                    <div className='inputCon'>
                        <label className='inputLabelCon' htmlFor="state" >
                            <p className='labelTitle'>State</p>
                            <p className='labelTitle error'>{errors.state}</p>
                            </label> 
                        <input 
                            type="text" 
                            name="state" 
                            id="state" 
                            className='spotInput'
                            placeholder='STATE'
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                        />
                    </div>
                </section>
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
                {/* </section> */}
                <p className='inputBorder'/>
                {/* Description */}
                <section className='inputSection'>
                    <h3 className='spotEditTitleSub'>Describe your place to guests</h3>
                    <p className='spotEditTitleDetails'>Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood.</p>
                    <textarea 
                        name="description" 
                        id="description" 
                        className='spotInput'
                        placeholder='Description' 
                        cols="30" rows="10"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        />
                    <p className='labelTitle error'>{errors.description}</p>
                </section>
                <p className='inputBorder'/>
                {/* Name */}
                <section className='inputSection'>
                    <h3 className='spotEditTitleSub'>Create a title for your spot</h3>
                    <p className='spotEditTitleDetails'>{"Catch guests' attention with a spot title that highlights what makes your place special."}</p>
                    <input 
                        type="text" 
                        name="name" 
                        id="name" 
                        className='spotInput'
                        placeholder='Name of your spot'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <p className='labelTitle error'>{errors.name}</p>
                </section>
                <p className='inputBorder'/>
                {/* Price */}
                <section className='inputSection'>
                    <h3 className='spotEditTitleSub'>Set a base price for your spot</h3>
                    <p className='spotEditTitleDetails'>Competitive pricing can help your listing stand out and rank higher in search results.</p>
                    <input 
                        type="text" 
                        name="price" 
                        id="price" 
                        className='spotInput'
                        placeholder='Price per night (USD)'
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                    <p className='labelTitle error'>{errors.price}</p>
                </section>
                <p className='inputBorder'/>
                {/* Images */}
                {isNew ? (
                    <section className='inputSection'>
                        <h3 className='spotEditTitleSub'>Liven up your spot with photos</h3>
                        <p className='spotEditTitleDetails'>Submit a link to at least one photo to publish your spot.</p>
                        <input 
                            type="text" 
                            name="imagePreview" 
                            id="imagePreview" 
                            className='spotInput'
                            placeholder='Preview Image URL'
                            value={imagePreview}
                            onChange={(e) => setImagePreview(e.target.value)}
                        />
                        <p className='labelTitle error' >{imageErrors[0]}</p>
                        <input 
                            type="text" 
                            name="image1" 
                            id="image1" 
                            className='spotInput'
                            placeholder='Image URL'
                            value={image1}
                            onChange={(e) => setImage1(e.target.value)}
                        />
                        <p className='labelTitle error'>{imageErrors[1]}</p>
                        <input 
                            type="text" 
                            name="image2" 
                            id="image2" 
                            className='spotInput'
                            placeholder='Image URL'
                            value={image2}
                            onChange={(e) => setImage2(e.target.value)}
                        />
                        <p className='labelTitle error'>{imageErrors[2]}</p>
                        <input 
                            type="text" 
                            name="image3" 
                            id="image3" 
                            className='spotInput'
                            placeholder='Image URL'
                            value={image3}
                            onChange={(e) => setImage3(e.target.value)}
                        />
                        <p className='labelTitle error'>{imageErrors[3]}</p>
                        <input 
                            type="text" 
                            name="image4" 
                            id="image4" 
                            className='spotInput'
                            placeholder='Image URL'
                            value={image4}
                            onChange={(e) => setImage4(e.target.value)}
                        />
                        <p className='labelTitle error'>{imageErrors[4]}</p>
                    </section>
                ):null}
                {isNew ? (<p className='inputBorder'/>):null}
                <button id='spotSubmit' type='submit'>Create Spot</button>
            </form>
        </div>
    );
}

export default SpotEdit;