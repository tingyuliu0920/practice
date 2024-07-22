import './profile.scss';
import FacebookTwoToneIcon from '@mui/icons-material/FacebookTwoTone';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import PinterestIcon from '@mui/icons-material/Pinterest';
import TwitterIcon from '@mui/icons-material/Twitter';
import PlaceIcon from '@mui/icons-material/Place';
import LanguageIcon from '@mui/icons-material/Language';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Posts from '../../components/posts/Posts';
import Update from '../../components/update/Update';
import { makeRequest } from '../../axios';
import { useLocation } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AuthContext } from '../../context/authContext';
import { useContext, useState } from 'react';

const Profile = () => {
  const [openUpdate, setOpenUpdate] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const userId = parseInt(useLocation().pathname.split('/')[2]);
  const { isPending, error, data } = useQuery({
    queryKey: ['user'],
    queryFn: () =>
      makeRequest.get('/users/find/' + userId).then((res) => {
        return res.data;
      }),
  });
  const { isPending: rIsPending, data: relationshipData } = useQuery({
    queryKey: ['relationship'],
    queryFn: () =>
      makeRequest.get('/relationships?followedUserId=' + userId).then((res) => {
        return res.data;
      }),
  });
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (following) => {
      if (following)
        return makeRequest.delete('/relationships?userId=' + userId);
      return makeRequest.post('/relationships', { userId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['relationship']);
    },
  });
  const handleFollow = async (e) => {
    mutation.mutate(relationshipData.includes(currentUser.id));
  };

  return (
    <div className="profile">
      {isPending ? (
        'Loading'
      ) : (
        <>
          <div className="images">
            <img src={'/upload/' + data?.coverPic} alt="" className="cover" />
            <img
              src={'/upload/' + data?.profilePic}
              alt=""
              className="profilePic"
            />
          </div>
          <div className="profileContainer">
            <div className="uInfo">
              <div className="left">
                <a href="http://facebook.com">
                  <FacebookTwoToneIcon fontSize="large" />
                </a>
                <a href="http://facebook.com">
                  <InstagramIcon fontSize="large" />
                </a>
                <a href="http://facebook.com">
                  <TwitterIcon fontSize="large" />
                </a>
                <a href="http://facebook.com">
                  <LinkedInIcon fontSize="large" />
                </a>
                <a href="http://facebook.com">
                  <PinterestIcon fontSize="large" />
                </a>
              </div>
              <div className="center">
                <span>{data?.name}</span>
                <div className="info">
                  <div className="item">
                    <PlaceIcon />
                    <span>{data?.city}</span>
                  </div>
                  <div className="item">
                    <LanguageIcon />
                    <span>{data?.website}</span>
                  </div>
                </div>
                {rIsPending ? (
                  'Loading'
                ) : currentUser.id === data.id ? (
                  <button onClick={() => setOpenUpdate(true)}>update</button>
                ) : (
                  <button onClick={handleFollow}>
                    {relationshipData.includes(currentUser.id)
                      ? 'following'
                      : 'follow'}
                  </button>
                )}
              </div>
              <div className="right">
                <EmailOutlinedIcon />
                <MoreVertIcon />
              </div>
            </div>
            <Posts userId={data.id} />
            {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={data} />}
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
