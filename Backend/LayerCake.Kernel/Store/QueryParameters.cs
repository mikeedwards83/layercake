namespace LayerCake.Kernel.Store
{
    public abstract class QueryParameters(int skip, int take)
    {
        public int Skip { get; set; }  = skip;
        public int Take { get; set; } = take;   
    }
}
