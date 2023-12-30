function MenuItem({ item }) {
  return (
    <div>
      <h3>{item.name}</h3>
      <p>{item.type}</p>
      <p>{item.price}</p>
    </div>
  );
}

export default MenuItem;
