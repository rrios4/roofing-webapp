import React from 'react';

const Options = (props) => {
  const { data } = props;

  if (data?.length > 0) {
    return (
      <>
        {data?.map((item, index) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </>
    );
  } else {
    return (
      <>
        <option>Data not available! ❌</option>
      </>
    );
  }
};

export default Options;
