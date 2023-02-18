namespace Yokogawa.Data.Infrastructure.Entities.Base
{
    public interface IEntity<TId>
    {
        TId Id { get; }
    }
}
