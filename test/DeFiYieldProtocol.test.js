const { expectRevert } = require('@openzeppelin/test-helpers');
const DeFiYieldProtocol = artifacts.require('DeFiYieldProtocol');

contract('DeFiYieldProtocol', ([alice, bob, carol]) => {
    beforeEach(async () => {
        this.dyp = await DeFiYieldProtocol.new({ from: alice });
    });


    it('Name CHECKED, Symbol CHECKED, Decimals CHECKED, TotalSupply CHECKED', async () => {
        const name = await this.dyp.name();
        const symbol = await this.dyp.symbol();
        const decimals = await this.dyp.decimals();
        const totalSupply = await this.dyp.totalSupply();
        const aliceBal = await this.dyp.balanceOf(alice);
        assert.equal(name.valueOf(), 'DeFiYieldProtocol');
        assert.equal(symbol.valueOf(), 'DYP');
        assert.equal(decimals.valueOf(), '18');
        assert.equal(totalSupply.valueOf(), '30000000000000000000000000');
        /*  
            TotalSupply has to be equal with AliceBalance, because 
            we've minted all the tokens from the beggining! ;)
        */
        assert.equal(aliceBal, '30000000000000000000000000');
    });


    it('Token transfer CHECKED', async () => {
        await this.dyp.transfer(carol, '10', { from: alice });        
        await this.dyp.transfer(bob, '20', { from: alice });
        await this.dyp.transfer(carol, '10', { from: bob });
        const aliceBal = await this.dyp.balanceOf(alice);
        const bobBal = await this.dyp.balanceOf(bob);
        const carolBal = await this.dyp.balanceOf(carol);
        assert.equal(carolBal.valueOf(), '20');
        assert.equal(bobBal.valueOf(), '10');
    });

    it('Bad transfer CHECKED', async () => {

        await expectRevert(
            this.dyp.transfer(carol, '100000', { from: bob }),
            'ERC20: transfer amount exceeds balance',
        );
        await expectRevert(
            this.dyp.transfer(alice, '999999', { from: bob }),
            'ERC20: transfer amount exceeds balance',
        );
        await expectRevert(
            this.dyp.transfer(alice, '13', { from: carol }),
            'ERC20: transfer amount exceeds balance',
        );
    });
  });
